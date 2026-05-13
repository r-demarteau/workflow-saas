const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');
const { sendWelcomeEmail } = require('./email');

const TENANTS_DIR  = process.env.TENANTS_DIR  || '/opt/nemofirm/tenants';
const NGINX_DIR    = process.env.NGINX_DIR     || '/etc/nginx/sites-available';
const PORT_FILE    = path.join(TENANTS_DIR, '.port-counter');
const PORT_START   = 3100;
const DOMAIN       = process.env.DOMAIN        || 'nemofirm.com';
const APP_IMAGE    = process.env.APP_IMAGE      || 'ghcr.io/nemofirm/woo-client:latest';

// ── Helpers ──────────────────────────────────────────────────────────────────
function randomString(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

function randomPassword(length = 16) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
  return Array.from(crypto.randomBytes(length))
    .map(b => chars[b % chars.length])
    .join('');
}

function nextPort() {
  fs.mkdirSync(TENANTS_DIR, { recursive: true });
  const lockFile = PORT_FILE + '.lock';
  const deadline = Date.now() + 5000;

  // Spin-lock using atomic exclusive file creation
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
  const adminPassword        = randomPassword(16);

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
    .replace(/\{\{ADMIN_EMAIL\}\}/g,             email)
    .replace(/\{\{APP_IMAGE\}\}/g,               APP_IMAGE);

  fs.writeFileSync(path.join(tenantDir, 'docker-compose.yml'), compose);

  // 2b. Write secrets to a separate file with restricted permissions
  const secrets = [
    `DB_PASSWORD=${dbPass}`,
    `DB_ROOT_PASSWORD=${dbRootPass}`,
    `MYSQL_PASSWORD=${dbPass}`,
    `MYSQL_ROOT_PASSWORD=${dbRootPass}`,
    `AUTH_SECRET=${authSecret}`,
    `SESSION_ENCRYPTION_KEY=${sessionEncryptionKey}`,
    `TICKET_WEBHOOK_TOKEN=${ticketWebhookToken}`,
    `ADMIN_PASS=${adminPassword}`,
  ].join('\n') + '\n';

  const secretsFile = path.join(tenantDir, '.env.secrets');
  fs.writeFileSync(secretsFile, secrets, { mode: 0o600 });

  // 3. Start the stack (image is local — no pull needed)
  run('docker compose up -d', tenantDir);

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

  // 6. Enable vhost + reload nginx
  const enabledPath = `/etc/nginx/sites-enabled/${slug}.${DOMAIN}.conf`;
  if (!fs.existsSync(enabledPath)) {
    run(`ln -s ${nginxFile} ${enabledPath}`, '/');
  }
  run('nginx -s reload', '/');

  // 7. Request SSL cert (uses existing wildcard — no extra certbot needed)
  // Wildcard cert covers *.nemofirm.com automatically.

  // 8. Send welcome email
  await sendWelcomeEmail({ email, slug, domain: DOMAIN, adminPassword });

  return { port };
}

module.exports = { provisionTenant };
