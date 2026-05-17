const fs   = require('fs');
const path = require('path');
const { execSync, execFileSync } = require('child_process');
const mysql = require('mysql2');
const { randomString, randomPassword, hashToken, encryptSetting } = require('./utils');
const { sendWelcomeEmailSetup, sendWelcomeEmailReady } = require('./email');

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
    } catch (err) {
      if (attempt === 60) throw new Error(`DB never became ready for auth fix: ${slug}: ${err.message}`);
      if (attempt === 1 || attempt % 10 === 0) console.log(`  [provision] waiting for DB (attempt ${attempt}/60): ${err.message}`);
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
  // SELECT the column directly — mariadb exits non-zero with "Unknown column" if
  // migration 011 hasn't run yet, and exits 0 (success) once it exists.
  const checkTableSql = `SELECT magic_token FROM settings WHERE 1=0;`;

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
    } catch (err) {
      if (attempt === 90) throw new Error(`DB/migrations never became ready for tenant ${slug}: ${err.message}`);
      if (attempt === 1 || attempt % 10 === 0) console.log(`  [provision] waiting for migrations (attempt ${attempt}/90): ${err.message}`);
      execSync('sleep 3');
    }
  }
  console.log(`  [provision] magic token seeded (seeded=${seeded})`);

  // 5. Provision WordPress if requested
  let wpInstalled   = false;
  let wcInstalled   = false;
  let wcApiKey      = null;
  let wcApiSecret   = null;
  let wpAppPassword = null;
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

    // Write WordPress secrets (DB creds + generated admin account).
    // WORDPRESS_DB_HOST is also written here so the WordPress entrypoint reliably
    // picks it up — the environment: section in docker-compose is sometimes ignored
    // in favour of env_file when both are present.
    const wpSecrets = [
      `WORDPRESS_DB_HOST=${slug}-db-1`,
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
    // Run as uid 33 (Debian www-data) — the wordpress:latest image creates all files
    // owned by uid 33. The wordpress:cli image is Alpine where www-data is uid 82, so
    // running as root and letting the entrypoint su-exec to www-data results in uid 82
    // hitting the volume as "other" (no write). Explicitly passing --user 33 bypasses
    // the su-exec and matches the file ownership on the shared volume.
    // Newer WordPress images use getenv_docker() in wp-config.php instead of hardcoded
    // values, so credentials must be passed as env vars — not just present in wp-config.
    const wpCli = (wpArgs) => [
      'run', '--rm',
      '--user', '33',
      '--network', wpNetwork,
      '-v', `${wpVol}:/var/www/html`,
      '-e', `WORDPRESS_DB_NAME=${wpDbName}`,
      '-e', `WORDPRESS_DB_USER=${wpDbUser}`,
      '-e', `WORDPRESS_DB_PASSWORD=${wpDbPass}`,
      '-e', `WORDPRESS_DB_HOST=${slug}-db-1`,
      'wordpress:cli',
      'wp', '--path=/var/www/html',
      ...wpArgs,
    ];

    // Step A+B: wait for the WordPress container's entrypoint to generate wp-config.php,
    // then patch it via docker exec (root) to fix DB_HOST and add cookie-path defines.
    //
    // Why docker exec instead of wp config create:
    //   - The WordPress entrypoint creates wp-config.php owned by root.
    //   - WP-CLI running as www-data (separate container) gets EACCES trying to overwrite it.
    //   - docker exec runs as root by default → can patch root-owned files without issue.
    //
    // Why patch instead of trusting WORDPRESS_DB_HOST env var:
    //   - Despite WORDPRESS_DB_HOST being set in docker-compose, the entrypoint consistently
    //     writes DB_HOST='mysql' (the hardcoded default) — likely a race in env application.
    //   - Patching after the fact is robust regardless of the root cause.
    const wpContainer = `${slug}-wp-1`;
    try {
      console.log('  [provision] waiting for wp-config.php...');
      for (let attempt = 1; attempt <= 60; attempt++) {
        try {
          // grep -q ensures DB_HOST is present (file fully written), not just that the file exists.
          // test -f passes while WordPress is still writing the file, causing null bytes on read.
          execFileSync('docker', ['exec', wpContainer, 'grep', '-q', 'DB_HOST', '/var/www/html/wp-config.php'], { stdio: 'ignore' });
          console.log('  [provision] wp-config.php ready');
          break;
        } catch (err) {
          if (attempt === 60) throw new Error('wp-config.php never appeared');
          if (attempt === 1 || attempt % 10 === 0) console.log(`  [provision] waiting for wp-config.php (attempt ${attempt}/60): ${err.message}`);
          execSync('sleep 3');
        }
      }
      // Write a PHP patch script to a temp file and docker cp it in.
      // Writing to a file avoids all shell/quote escaping issues that break php -r one-liners.
      const patchFile = `/tmp/wp-patch-${slug}.php`;
      fs.writeFileSync(patchFile, [
        `<?php`,
        `$f = '/var/www/html/wp-config.php';`,
        `$c = file_get_contents($f);`,
        // Match the full define('DB_HOST', ...) statement including the closing );
        `$c = preg_replace('/define[^)]*DB_HOST[^)]*\\)[^;]*;/', "define( 'DB_HOST', '${slug}-db-1' );", $c);`,
        // Append COOKIEPATH defines before the stop-editing comment if not present
        `if (strpos($c, 'COOKIEPATH') === false) {`,
        `  $extra = "define('COOKIEPATH','/');define('SITECOOKIEPATH','/');define('ADMIN_COOKIE_PATH','/');define('PLUGINS_COOKIE_PATH','/');" . PHP_EOL;`,
        `  $c = str_replace("/* That's all", $extra . "/* That's all", $c);`,
        `}`,
        // Prepend /wp to REQUEST_URI so WordPress sees /wp/wp-json/... instead of
        // /wp-json/... — nginx strips the /wp/ prefix before forwarding to Apache,
        // but WordPress needs to see its own site path prefix to route the REST API.
        `if (strpos($c, 'REQUEST_URI') === false) {`,
        `  $fix = "if(php_sapi_name()!=='cli'&&isset(\\$_SERVER['REQUEST_URI'])&&substr(\\$_SERVER['REQUEST_URI'],0,4)!=='/wp/'){\\$_SERVER['REQUEST_URI']='/wp'.\\$_SERVER['REQUEST_URI'];}" . PHP_EOL;`,
        `  $c = str_replace("/* That's all", $fix . "/* That's all", $c);`,
        `}`,
        `file_put_contents($f, $c);`,
        `preg_match('/define[^;]*DB_HOST[^;]*;/', $c, $m);`,
        `echo (isset($m[0]) ? trim($m[0]) : 'DB_HOST not found') . PHP_EOL;`,
      ].join('\n'));
      execSync(`docker cp ${patchFile} ${wpContainer}:/tmp/patch.php`);
      try { fs.unlinkSync(patchFile); } catch {}
      execFileSync('docker', ['exec', wpContainer, 'php', '/tmp/patch.php'], { stdio: 'inherit' });
      console.log('  [provision] wp-config.php patched');
      // Fix wp-content ownership so the WP-CLI container (running as www-data)
      // can install plugins and create subdirs like wp-content/upgrade.
      execFileSync('docker', ['exec', wpContainer, 'chown', '-R', 'www-data:www-data', '/var/www/html/wp-content'], { stdio: 'inherit' });
    } catch (err) {
      console.error(`  [provision] ERROR patching wp-config.php: ${err.message}`);
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
          // Set pretty permalinks so Apache routes /wp-json/ to index.php.
          // wp rewrite --hard can't write .htaccess as uid 33 (root-owned file), so
          // write it via docker exec (runs as root) then flush rules via WP-CLI.
          const htaccess = [
            '# BEGIN WordPress',
            '<IfModule mod_rewrite.c>',
            'RewriteEngine On',
            'RewriteBase /',
            'RewriteRule ^index\\.php$ - [L]',
            'RewriteCond %{REQUEST_FILENAME} !-f',
            'RewriteCond %{REQUEST_FILENAME} !-d',
            'RewriteRule . /index.php [L]',
            '</IfModule>',
            '# END WordPress',
          ].join('\n');
          const htaccessLocal = `/tmp/htaccess-${slug}`;
          fs.writeFileSync(htaccessLocal, htaccess + '\n');
          execSync(`docker cp ${htaccessLocal} ${wpContainer}:/var/www/html/.htaccess`);
          try { fs.unlinkSync(htaccessLocal); } catch {}
          execFileSync('docker', wpCli(['rewrite', 'structure', '/%postname%/']), { stdio: 'inherit' });
          console.log('  [provision] permalink structure set and .htaccess written');
          break;
        } catch (err) {
          if (attempt === 30) throw new Error(`wp core install failed after 30 attempts: ${err.message}`);
          if (attempt === 1 || attempt % 5 === 0) console.log(`  [provision] wp core install attempt ${attempt}/30: ${err.message}`);
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

    // Step E: generate WooCommerce REST API keys and pre-configure the tenant app.
    // Uses wp eval-file via the shared volume so no shell quoting issues.
    if (wcInstalled) {
      try {
        console.log('  [provision] generating WooCommerce API keys...');
        const keygenScript = [
          `<?php`,
          `$ck = 'ck_' . wc_rand_hash();`,
          `$cs = 'cs_' . wc_rand_hash();`,
          `global $wpdb;`,
          `$ok = $wpdb->insert($wpdb->prefix . 'woocommerce_api_keys', array(`,
          `  'user_id'         => 1,`,
          `  'description'     => 'Teamdock',`,
          `  'permissions'     => 'read_write',`,
          `  'consumer_key'    => wc_api_hash($ck),`,
          `  'consumer_secret' => $cs,`,
          `  'truncated_key'   => substr($ck, -7),`,
          `));`,
          `if ($ok) { echo $ck . "\\n" . $cs . "\\n"; }`,
          `else { fwrite(STDERR, $wpdb->last_error . "\\n"); exit(1); }`,
        ].join('\n');

        // Write to the shared wp volume via the running container, then eval-file
        const tmpLocal = `/tmp/wc-keygen-${slug}.php`;
        fs.writeFileSync(tmpLocal, keygenScript);
        execSync(`docker cp ${tmpLocal} ${wpContainer}:/var/www/html/wc-keygen.php`);
        try { fs.unlinkSync(tmpLocal); } catch {}

        const out = execFileSync('docker', wpCli(['eval-file', '/var/www/html/wc-keygen.php']), { encoding: 'utf8' });
        try { execFileSync('docker', ['exec', wpContainer, 'rm', '-f', '/var/www/html/wc-keygen.php']); } catch {}

        const [ck, cs] = out.trim().split('\n');
        if (ck?.startsWith('ck_') && cs?.startsWith('cs_')) {
          wcApiKey    = ck.trim();
          wcApiSecret = cs.trim();
          console.log(`  [provision] WC API keys generated (${ck.slice(0, 10)}...)`);
        } else {
          throw new Error(`unexpected keygen output: ${out.trim().slice(0, 120)}`);
        }
      } catch (err) {
        console.error(`  [provision] ERROR generating WC API keys: ${err.message}`);
      }
    }

    // Step F: generate a WordPress Application Password for Teamdock login.
    // Regular WP admin passwords are not accepted — the app authenticates via
    // the WP REST API which requires an Application Password.
    if (wcApiKey && wcApiSecret) {
      try {
        console.log('  [provision] generating WordPress Application Password...');
        const out = execFileSync('docker', wpCli([
          'user', 'application-password', 'create', '1', 'Teamdock', '--porcelain',
        ]), { encoding: 'utf8' });
        wpAppPassword = out.trim();
        console.log('  [provision] Application Password generated');
      } catch (err) {
        console.error(`  [provision] ERROR generating Application Password: ${err.message}`);
      }
    }

    // Step G: if we have keys, encrypt and pre-seed into the tenant app — skip setup wizard.
    if (wcApiKey && wcApiSecret) {
      try {
        const config = JSON.stringify({
          wc_url:             wpUrl,
          wc_consumer_key:    encryptSetting(wcApiKey,    sessionEncryptionKey),
          wc_consumer_secret: encryptSetting(wcApiSecret, sessionEncryptionKey),
        });
        const autoSql = `UPDATE settings SET config=${mysql.escape(config)}, setup_complete=1, magic_token=NULL, magic_token_exp=NULL WHERE id=1;`;
        runSql(dbContainer, dbName, autoSql);
        console.log('  [provision] app pre-configured — setup wizard bypassed');
      } catch (err) {
        console.error(`  [provision] ERROR pre-configuring app: ${err.message}`);
        // Leave setup_complete=0 so the wizard fallback still works
        wcApiKey = null;
      }
    }

    console.log(`  [provision] WordPress live at ${wpUrl} (port ${wpPort}), installed=${wpInstalled}, wc=${wcInstalled}, autoConfigured=${!!wcApiKey}, appPassword=${!!wpAppPassword}`);
  }

  // 6. Send welcome email.
  // WP package with full auto-config → direct login email (no wizard link).
  // Everything else (BYO WooCommerce, or WP where auto-config failed) → setup wizard email.
  const wpFullyReady = !!(wordpress && wpPort && wcApiKey && wpAppPassword);
  if (wpFullyReady) {
    await sendWelcomeEmailReady({
      email,
      slug,
      domain:       DOMAIN,
      wpAdminUrl:   `${wpUrl}/wp-admin`,
      wpAdminUser,
      wpAdminPass,
      wpAppPassword,
    });
  } else {
    await sendWelcomeEmailSetup({
      email,
      slug,
      domain:     DOMAIN,
      setupToken,
      ...(wordpress && wpPort && { wpAdminUrl: `${wpUrl}/wp-admin`, wpAdminUser, wpAdminPass, wpInstalled, wcInstalled }),
    });
  }

  return { port };
}

module.exports = { provisionTenant };
