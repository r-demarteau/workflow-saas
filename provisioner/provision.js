const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const mysql = require('mysql2');
const { randomString, randomPassword, hashToken } = require('./utils');
const { sendWelcomeEmail } = require('./email');

const TENANTS_DIR  = process.env.TENANTS_DIR  || '/opt/nemofirm/tenants';
const NGINX_DIR    = process.env.NGINX_DIR     || '/etc/nginx/sites-available';
const PORT_FILE    = path.join(TENANTS_DIR, '.port-counter');
const PORT_START   = 3100;
const DOMAIN       = process.env.DOMAIN        || 'nemofirm.com';
const APP_IMAGE    = process.env.APP_IMAGE      || 'ghcr.io/nemofirm/woo-client:latest';

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

async function provisionTenant({ slug, plan, email }) {
  const tenantDir = path.join(TENANTS_DIR, slug);

  if (fs.existsSync(tenantDir)) {
    throw new Error(`Tenant ${slug} already exists.`);
  }

  const port          = nextPort();
  const dbName        = `nemo_${slug.replace(/-/g, '_')}`;
  const dbUser        = dbName;
  const dbPass               = randomString(24);
  const dbRootPass           = randomString(24);
  const authSecret           = randomString(32);
  const sessionEncryptionKey = randomString(32);
  const ticketWebhookToken   = randomString(32);
  const setupToken           = randomString(32);           // raw — goes in email URL
  const setupTokenHash       = hashToken(setupToken);      // stored in DB
  const setupTokenExp        = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60;

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
  ].join('\n') + '\n';

  fs.writeFileSync(path.join(tenantDir, '.env.secrets'), secrets, { mode: 0o600 });

  // 3. Start the stack
  run('docker compose up -d', tenantDir);

  // 3b. Wait for DB to be healthy, then seed the hashed magic token + admin email.
  // The password never appears in the host process list — it comes from the
  // container's own MYSQL_ROOT_PASSWORD env var, and SQL is piped via stdin.
  const dbContainer = `${slug}-db-1`;

  const sql = [
    `INSERT INTO settings (id, config, setup_complete, magic_token, magic_token_exp, admin_email)`,
    `VALUES (1, '{}', 0, ${mysql.escape(setupTokenHash)}, ${setupTokenExp}, ${mysql.escape(email)})`,
    `ON DUPLICATE KEY UPDATE`,
    `  magic_token=${mysql.escape(setupTokenHash)},`,
    `  magic_token_exp=${setupTokenExp},`,
    `  admin_email=${mysql.escape(email)};`,
  ].join(' ');

  let seeded = false;
  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      runSql(dbContainer, dbName, sql);
      seeded = true;
      break;
    } catch {
      if (attempt === 30) throw new Error(`DB never became ready for tenant ${slug}`);
      execSync('sleep 2');
    }
  }
  console.log(`  [provision] magic token seeded (seeded=${seeded})`);

  // 4. Write nginx vhost
  const nginxTemplate = fs.readFileSync(
    path.join(__dirname, 'templates', 'nginx.template.conf'), 'utf8'
  );
  const nginxConf = nginxTemplate
    .replace(/\{\{SLUG\}\}/g,   slug)
    .replace(/\{\{PORT\}\}/g,   String(port))
    .replace(/\{\{DOMAIN\}\}/g, DOMAIN);

  const nginxFile = path.join(NGINX_DIR, `${slug}.${DOMAIN}.conf`);
  fs.writeFileSync(nginxFile, nginxConf);

  // 5. Enable vhost + reload nginx
  const enabledPath = `/etc/nginx/sites-enabled/${slug}.${DOMAIN}.conf`;
  if (!fs.existsSync(enabledPath)) {
    run(`ln -s ${nginxFile} ${enabledPath}`, '/');
  }
  run('nginx -s reload', '/');

  // 6. Send welcome email — the raw token goes in the URL, not the hash
  await sendWelcomeEmail({ email, slug, domain: DOMAIN, setupToken });

  return { port };
}

module.exports = { provisionTenant };
