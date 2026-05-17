const fs   = require('fs');
const path = require('path');
const { execSync, execFileSync } = require('child_process');
const mysql = require('mysql2');
const { randomString, randomPassword, hashToken } = require('./utils');
const { sendWelcomeEmail } = require('./email');

const TENANTS_DIR  = process.env.TENANTS_DIR  || '/opt/teamdock/tenants';
const NGINX_DIR    = process.env.NGINX_DIR     || '/etc/nginx/sites-available';
const PORT_FILE    = path.join(TENANTS_DIR, '.port-counter');
const PORT_START   = 3100;
const DOMAIN       = process.env.DOMAIN        || 'teamdock.ai';
const CERT_NAME    = process.env.CERT_NAME      || DOMAIN;
const APP_IMAGE    = process.env.APP_IMAGE      || 'ghcr.io/teamdock/woo-client:latest';

// ── Helpers ──────────────────────────────────────────────────────────────────

function nextPort() {
  fs.mkdirSync(TENANTS_DIR, { recursive: true });
  const lockFile = PORT_FILE + '.lock';
  const deadline = Date.now() + 5000;

  while (true) {
    try {
      fs.writeFileSync(lockFile, String(process.pid), { flag: 'wx' });
      break;
    } catch {
      if (Date.now() > deadline) throw new Error('Could not acquire port lock after 5s');
      execSync('sleep 0.05');
    }
  }

  try {
    let port = PORT_START;
    if (fs.existsSync(PORT_FILE)) {
      port = parseInt(fs.readFileSync(PORT_FILE, 'utf8').trim(), 10) + 1;
    }
    fs.writeFileSync(PORT_FILE, String(port));
    return port;
  } finally {
    try { fs.unlinkSync(lockFile); } catch {}
  }
}

function run(cmd, cwd) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

// Runs a command with SQL piped via stdin — keeps SQL out of the process list.
function runSql(dbContainer, dbName, sql) {
  console.log(`  $ docker exec -i ${dbContainer} mariadb [sql via stdin]`);
  // $MYSQL_ROOT_PASSWORD is already set in the container's environment (.env.secrets).
  // Using it here means the password never appears in the host process list.
  const cmd = `docker exec -i ${dbContainer} sh -c 'mariadb -u root -p"$MYSQL_ROOT_PASSWORD" "${dbName}"'`;
  execSync(cmd, { input: sql + '\n', encoding: 'utf8', stdio: ['pipe', 'inherit', 'inherit'] });
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function provisionTenant({ slug, plan, email, wordpress = false }) {
  const tenantDir = path.join(TENANTS_DIR, slug);

  if (fs.existsSync(tenantDir)) {
    throw new Error(`Tenant ${slug} already exists.`);
  }

  const port          = nextPort();
  const wpPort        = wordpress ? nextPort() : null;
  const dbName        = `teamdock_${slug.replace(/-/g, '_')}`;
  const dbUser        = dbName;
  const dbPass               = randomString(24);
  const dbRootPass           = randomString(24);
  const authSecret           = randomString(32);
  const sessionEncryptionKey = randomString(32);
  const ticketWebhookToken   = randomString(32);
  const setupToken           = randomString(32);           // raw — goes in email URL
  const setupTokenHash       = hashToken(setupToken);      // stored in DB
  const setupTokenExp        = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60;
  const wpUrl                = wordpress ? `https://${slug}.${DOMAIN}/wp` : null;
  const wpAdminUser          = wordpress ? 'admin' : null;
  const wpAdminPass          = wordpress ? randomPassword(20) : null;

  // 1. Create tenant directory
  fs.mkdirSync(tenantDir, { recursive: true });

  // 2. Write docker-compose.yml
  const composeTemplate = fs.readFileSync(
    path.join(__dirname, 'templates', 'docker-compose.template.yml'), 'utf8'
  );
  const compose = composeTemplate
    .replace(/\{\{SLUG\}\}/g,           slug)
    .replace(/\{\{PORT\}\}/g,           String(port))
    .replace(/\{\{DB_NAME\}\}/g,        dbName)
    .replace(/\{\{DB_USER\}\}/g,        dbUser)
    .replace(/\{\{ADMIN_EMAIL\}\}/g,    email)
    .replace(/\{\{APP_IMAGE\}\}/g,      APP_IMAGE);

  fs.writeFileSync(path.join(tenantDir, 'docker-compose.yml'), compose);

  // 2b. Write secrets with restricted permissions
  const secrets = [
    `DB_PASSWORD=${dbPass}`,
    `DB_ROOT_PASSWORD=${dbRootPass}`,
    `MYSQL_PASSWORD=${dbPass}`,
    `MYSQL_ROOT_PASSWORD=${dbRootPass}`,
    `AUTH_SECRET=${authSecret}`,
    `SESSION_ENCRYPTION_KEY=${sessionEncryptionKey}`,
    `TICKET_WEBHOOK_TOKEN=${ticketWebhookToken}`,
    // SMTP — propagated from provisioner env so tenant can resend magic links
    `SMTP_HOST=${process.env.SMTP_HOST || ''}`,
    `SMTP_PORT=${process.env.SMTP_PORT || '587'}`,
    `SMTP_SECURE=${process.env.SMTP_SECURE || 'false'}`,
    `SMTP_USER=${process.env.SMTP_USER || ''}`,
    `SMTP_PASS=${process.env.SMTP_PASS || ''}`,
    `SMTP_FROM=${process.env.SMTP_FROM || ''}`,
    `PUBLIC_BASE_URL=https://${slug}.${DOMAIN}`,
    // Invoice Ninja shared instance — same for all tenants
    `INVOICENINJA_URL=${process.env.INVOICENINJA_URL || ''}`,
    `INVOICENINJA_ADMIN_TOKEN=${process.env.INVOICENINJA_ADMIN_TOKEN || ''}`,
  ].join('\n') + '\n';

  fs.writeFileSync(path.join(tenantDir, '.env.secrets'), secrets, { mode: 0o600 });

  // 3. Register the nginx vhost immediately so the subdomain is live right away.
  // While the app container is still starting, nginx serves setup-pending.html (via
  // proxy_intercept_errors + error_page 502) so users see a branded loading page
  // instead of the browser's generic "connection refused" or the marketing site.
  const nginxTemplate = fs.readFileSync(
    path.join(__dirname, 'templates', 'nginx.template.conf'), 'utf8'
  );
  const wpProxyHeaders = `
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        client_max_body_size 64M;`;

  // WordPress paths.
  // /wp/ is the canonical proxy path — all WP URLs including wp-admin use this prefix.
  // WP_SITEURL is set to https://{slug}.{domain}/wp so WordPress generates links like
  // /wp/wp-admin/ and sets login cookies scoped to path /wp/.
  //
  // /wp-admin/ and /wp-login.php redirect to /wp/... so that any bookmarked or
  // externally-generated bare links still work.  Proxying them directly would cause
  // a cookie-path mismatch (cookies set at /wp/ are not sent for /wp-admin/ requests)
  // which makes WordPress log the user out on every page load.
  //
  // /xmlrpc.php is kept as a direct proxy because REST clients don't follow redirects.
  const wpLocation = wpPort ? `
    location /wp/ {
        proxy_pass         http://127.0.0.1:${wpPort}/;${wpProxyHeaders}
    }
    location /wp-admin/ {
        return 301 /wp$request_uri;
    }
    location = /wp-login.php {
        return 301 /wp/wp-login.php$is_args$args;
    }
    location = /xmlrpc.php {
        proxy_pass         http://127.0.0.1:${wpPort}/xmlrpc.php;${wpProxyHeaders}
    }
` : '';

  const nginxConf = nginxTemplate
    .replace(/\{\{SLUG\}\}/g,        slug)
    .replace(/\{\{PORT\}\}/g,        String(port))
    .replace(/\{\{DOMAIN\}\}/g,      DOMAIN)
    .replace(/\{\{CERT_NAME\}\}/g,   CERT_NAME)
    .replace(/\{\{WP_LOCATION\}\}/g, wpLocation);

  const nginxFile = path.join(NGINX_DIR, `${slug}.${DOMAIN}.conf`);
  fs.writeFileSync(nginxFile, nginxConf);

  const enabledPath = `/etc/nginx/sites-enabled/${slug}.${DOMAIN}.conf`;
  if (!fs.existsSync(enabledPath)) {
    run(`ln -s ${nginxFile} ${enabledPath}`, '/');
  }
  run('nginx -s reload', '/');

  // 4. Start only the DB first so we can fix auth before the app connects.
  run('docker compose up -d db', tenantDir);

  // 3a. Wait for DB to be healthy, then fix the teamdock user's TCP auth.
  // MariaDB Docker init creates the user via socket; the password hash it stores
  // is sometimes not accepted by mysql2 over TCP. ALTER USER via the root socket
  // (docker exec) re-hashes it correctly before the app ever tries to connect.
  const dbContainer = `${slug}-db-1`;
  const fixAuthSql = `ALTER USER ${mysql.escape(dbUser)}@'%' IDENTIFIED BY ${mysql.escape(dbPass)}; FLUSH PRIVILEGES;`;
  for (let attempt = 1; attempt <= 60; attempt++) {
    try {
      runSql(dbContainer, 'mysql', fixAuthSql);
      console.log('  [provision] DB user auth fixed');
      break;
    } catch {
      if (attempt === 60) throw new Error(`DB never became ready for auth fix: ${slug}`);
      execSync('sleep 3');
    }
  }

  // 3b. Now start the full stack (app can connect because auth is already fixed).
  run('docker compose up -d', tenantDir);

  // 3c. Wait for the app to finish running migrations (settings table must exist),
  // then seed the hashed magic token + admin email.
  // Uses 90 attempts × 3s = 4.5 min max — enough for a cold image start + migrations.
  // The password never appears in the host process list — it comes from the
  // container's own MYSQL_ROOT_PASSWORD env var, and SQL is piped via stdin.
  // Wait for migration 011 (setup_complete column) — not just the table — before seeding.
  const checkTableSql = `SELECT 1 FROM information_schema.columns WHERE table_schema=${mysql.escape(dbName)} AND table_name='settings' AND column_name='magic_token' LIMIT 1;`;

  const sql = [
    `INSERT INTO settings (id, config, magic_token, magic_token_exp, admin_email, wordpress, wp_url)`,
    `VALUES (1, '{}', ${mysql.escape(setupTokenHash)}, ${setupTokenExp}, ${mysql.escape(email)}, ${wordpress ? 1 : 0}, ${wpUrl ? mysql.escape(wpUrl) : 'NULL'})`,
    `ON DUPLICATE KEY UPDATE`,
    `  magic_token=${mysql.escape(setupTokenHash)},`,
    `  magic_token_exp=${setupTokenExp},`,
    `  admin_email=${mysql.escape(email)},`,
    `  wordpress=${wordpress ? 1 : 0},`,
    `  wp_url=${wpUrl ? mysql.escape(wpUrl) : 'NULL'};`,
  ].join(' ');

  let seeded = false;
  for (let attempt = 1; attempt <= 90; attempt++) {
    try {
      // First confirm the settings table exists (app has run migrations)
      runSql(dbContainer, dbName, checkTableSql);
      // Table exists — do the insert
      runSql(dbContainer, dbName, sql);
      seeded = true;
      break;
    } catch {
      if (attempt === 90) throw new Error(`DB/migrations never became ready for tenant ${slug}`);
      execSync('sleep 3');
    }
  }
  console.log(`  [provision] magic token seeded (seeded=${seeded})`);

  // 5. Provision WordPress if requested
  let wpInstalled = false;
  let wcInstalled = false;
  if (wordpress && wpPort) {
    const wpDbName = `wp_${slug.replace(/-/g, '_')}`;
    const wpDbUser = wpDbName;
    const wpDbPass = randomString(24);

    // Create WP DB and user in the existing MariaDB container
    const createWpDb = [
      `CREATE DATABASE IF NOT EXISTS \`${wpDbName}\`;`,
      `CREATE USER IF NOT EXISTS ${mysql.escape(wpDbUser)}@'%' IDENTIFIED BY ${mysql.escape(wpDbPass)};`,
      `GRANT ALL PRIVILEGES ON \`${wpDbName}\`.* TO ${mysql.escape(wpDbUser)}@'%';`,
      `FLUSH PRIVILEGES;`,
    ].join(' ');
    runSql(dbContainer, 'mysql', createWpDb);

    // Write WordPress secrets (DB creds + generated admin account)
    const wpSecrets = [
      `WORDPRESS_DB_PASSWORD=${wpDbPass}`,
      `WORDPRESS_TABLE_PREFIX=wp_`,
      `WP_ADMIN_USER=${wpAdminUser}`,
      `WP_ADMIN_PASS=${wpAdminPass}`,
      `WP_ADMIN_URL=${wpUrl}/wp-admin`,
    ].join('\n') + '\n';
    fs.writeFileSync(path.join(tenantDir, '.env.wp.secrets'), wpSecrets, { mode: 0o600 });

    // Write WordPress docker-compose
    const wpComposeTemplate = fs.readFileSync(
      path.join(__dirname, 'templates', 'docker-compose-wp.template.yml'), 'utf8'
    );
    const wpCompose = wpComposeTemplate
      .replace(/\{\{SLUG\}\}/g,       slug)
      .replace(/\{\{WP_PORT\}\}/g,    String(wpPort))
      .replace(/\{\{WP_DB_NAME\}\}/g, wpDbName)
      .replace(/\{\{WP_DB_USER\}\}/g, wpDbUser)
      .replace(/\{\{WP_URL\}\}/g,     wpUrl);
    fs.writeFileSync(path.join(tenantDir, 'docker-compose-wp.yml'), wpCompose);

    // Start WordPress container (nginx /wp/ location already written above)
    run('docker compose -f docker-compose-wp.yml up -d', tenantDir);

    // Auto-install WordPress headlessly so the install wizard is never exposed.
    // Uses the official wordpress:cli image sharing the same named volume.
    // execFileSync avoids shell interpretation — passwords are passed as discrete args.
    // Non-fatal: a WP-CLI failure is logged but must not block the welcome email.
    const wpVol     = `${slug}_wp_data`;
    const wpNetwork = `${slug}_internal`;
    // Run as root — the wordpress:cli entrypoint automatically su's to www-data,
    // which is more reliable than -u www-data (avoids HOME/cache dir permission issues).
    const wpCli = (wpArgs) => [
      'run', '--rm',
      '--network', wpNetwork,
      '-v', `${wpVol}:/var/www/html`,
      'wordpress:cli',
      'wp', '--path=/var/www/html',
      ...wpArgs,
    ];

    // Step A: wait for WordPress files
    try {
      console.log('  [provision] waiting for WordPress files to land on volume...');
      for (let attempt = 1; attempt <= 60; attempt++) {
        try {
          execFileSync('docker', [
            'run', '--rm',
            '--entrypoint', 'ls',
            '-v', `${wpVol}:/var/www/html`,
            'wordpress:cli',
            '/var/www/html/wp-includes/version.php',
          ], { stdio: 'ignore' });
          console.log('  [provision] WordPress files ready');
          break;
        } catch {
          if (attempt === 60) throw new Error('WordPress files never landed on volume');
          execSync('sleep 3');
        }
      }
    } catch (err) {
      console.error(`  [provision] ERROR waiting for WP files: ${err.message}`);
    }

    // Step B: write correct wp-config.php
    try {
      console.log('  [provision] writing correct wp-config.php...');
      execFileSync('docker', wpCli([
        'config', 'create',
        '--force',
        '--skip-check',
        `--dbname=${wpDbName}`,
        `--dbuser=${wpDbUser}`,
        `--dbpass=${wpDbPass}`,
        `--dbhost=${slug}-db-1`,
        `--extra-php=define('WP_HOME','${wpUrl}');define('WP_SITEURL','${wpUrl}');define('COOKIEPATH','/');define('SITECOOKIEPATH','/');define('ADMIN_COOKIE_PATH','/');define('PLUGINS_COOKIE_PATH','/');`,
      ]), { stdio: 'inherit' });
      console.log('  [provision] wp-config.php written');
    } catch (err) {
      console.error(`  [provision] ERROR writing wp-config.php: ${err.message}`);
    }

    // Step C: wp core install (retries until MariaDB is ready)
    try {
      console.log('  [provision] installing WordPress core...');
      for (let attempt = 1; attempt <= 30; attempt++) {
        try {
          execFileSync('docker', wpCli([
            'core', 'install',
            `--url=${wpUrl}`,
            `--title=${slug} WooCommerce Store`,
            `--admin_user=${wpAdminUser}`,
            `--admin_password=${wpAdminPass}`,
            `--admin_email=${email}`,
            '--skip-email',
          ]), { stdio: 'inherit' });
          wpInstalled = true;
          console.log(`  [provision] WordPress installed — admin at ${wpUrl}/wp-admin`);
          break;
        } catch {
          if (attempt === 30) throw new Error('wp core install failed after 30 attempts');
          execSync('sleep 5');
        }
      }
    } catch (err) {
      console.error(`  [provision] ERROR installing WordPress core: ${err.message}`);
    }

    // Step D: install + activate WooCommerce, create shop pages
    if (wpInstalled) {
      try {
        console.log('  [provision] installing WooCommerce plugin...');
        execFileSync('docker', wpCli(['plugin', 'install', 'woocommerce', '--activate']), { stdio: 'inherit' });
        console.log('  [provision] creating WooCommerce shop pages...');
        execFileSync('docker', wpCli(['wc', 'tool', 'run', 'install_pages', '--user=1']), { stdio: 'inherit' });
        wcInstalled = true;
        console.log('  [provision] WooCommerce installed and shop pages created');
      } catch (err) {
        console.error(`  [provision] ERROR installing WooCommerce: ${err.message}`);
      }
    }

    console.log(`  [provision] WordPress live at ${wpUrl} (port ${wpPort}), installed=${wpInstalled}, wc=${wcInstalled}`);
  }

  // 6. Send welcome email — the raw token goes in the URL, not the hash.
  // Always include WP credentials when WordPress was provisioned: credentials are
  // generated before the WP-CLI block runs, so they're valid even if auto-install
  // failed and the tenant needs to use them for the manual install wizard.
  await sendWelcomeEmail({
    email,
    slug,
    domain: DOMAIN,
    setupToken,
    ...(wordpress && wpPort && { wpAdminUrl: `${wpUrl}/wp-admin`, wpAdminUser, wpAdminPass, wpInstalled, wcInstalled }),
  });

  return { port };
}

module.exports = { provisionTenant };
