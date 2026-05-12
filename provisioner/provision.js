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
  let port = PORT_START;
  if (fs.existsSync(PORT_FILE)) {
    port = parseInt(fs.readFileSync(PORT_FILE, 'utf8').trim(), 10) + 1;
  }
  fs.writeFileSync(PORT_FILE, String(port));
  return port;
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
  const dbPass        = randomString(24);
  const dbRootPass    = randomString(24);
  const sessionSecret = randomString(32);
  const encryptionKey = randomString(32);
  const adminPassword = randomPassword();

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
    .replace(/\{\{DB_PASS\}\}/g,        dbPass)
    .replace(/\{\{DB_ROOT_PASS\}\}/g,   dbRootPass)
    .replace(/\{\{SESSION_SECRET\}\}/g, sessionSecret)
    .replace(/\{\{ENCRYPTION_KEY\}\}/g, encryptionKey)
    .replace(/\{\{ADMIN_EMAIL\}\}/g,    email)
    .replace(/\{\{ADMIN_PASS\}\}/g,     adminPassword)
    .replace(/\{\{APP_IMAGE\}\}/g,      APP_IMAGE);

  fs.writeFileSync(path.join(tenantDir, 'docker-compose.yml'), compose);

  // 3. Start the stack
  run('docker compose pull --quiet', tenantDir);
  run('docker compose up -d', tenantDir);

  // 4. Wait for DB to be ready then run migrations
  console.log('  Waiting for database...');
  execSync('sleep 10');
  run('docker compose run --rm app node migrations/run.js', tenantDir);

  // 5. Write nginx vhost
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
