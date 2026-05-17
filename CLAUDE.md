# workflow-saas

The **SaaS billing and provisioning layer** for Teamdock. This is the
public-facing marketing site and Stripe checkout that, on successful payment,
automatically provisions a new isolated tenant workspace running `woo_client_codex`.

## How it all fits together

```
User visits teamdock.ai (this repo — workflow-saas)
  └─▶ picks plan → /register → Stripe Checkout
        └─▶ checkout.session.completed webhook
              └─▶ /api/webhook → calls provisioner HTTP API
                    └─▶ provisioner/server.js (runs on Hetzner at 127.0.0.1:3050)
                          └─▶ docker compose up  (woo_client_codex image)
                                └─▶ {slug}.teamdock.ai goes live
```

## Tech Stack

| Layer       | Technology                                           |
|-------------|------------------------------------------------------|
| Frontend    | SvelteKit 5 + Svelte 5, Tailwind CSS 3               |
| Billing     | Stripe (subscriptions, webhooks, 14-day trial)       |
| Provisioner | Node.js + Express (CommonJS), runs on the Hetzner host |
| Adapter     | `@sveltejs/adapter-node` → `build/index.js`          |
| Container   | Docker (multi-stage, node:22-alpine)                 |

## Project Structure

```
src/
  routes/
    +page.svelte          landing page (hero, features, trust signals)
    +layout.svelte        shared nav/layout
    pricing/+page.svelte  plan comparison (Starter €49, Growth €99, Pro €199)
    register/+page.svelte company name + email → Stripe redirect
    success/+page.svelte  post-payment confirmation page
    api/
      checkout/+server.ts  POST — create Stripe Checkout session
      webhook/+server.ts   POST — handle Stripe webhook → call provisioner
      session/+server.ts   GET  — return Stripe session details
  lib/stripe.ts           Stripe SDK singleton
provisioner/
  server.js               Express HTTP server (port 3050, localhost only)
  provision.js            core provisioning logic
  email.js                welcome email sender
  templates/
    docker-compose.template.yml  per-tenant Compose file
    nginx.template.conf          per-tenant nginx vhost
deploy/
  01-wildcard-ssl.sh      set up *.teamdock.ai wildcard cert
  02-deploy.sh            deploy script
  nginx-teamdock.conf     top-level nginx config
```

## Signup → Provision Flow

1. User fills `/register` (company name becomes slug, email).
2. `POST /api/checkout` — creates a Stripe Checkout session with `metadata: { slug, plan, email }`.
3. User pays (14-day trial). Stripe fires `checkout.session.completed`.
4. `POST /api/webhook` — verifies Stripe signature, reads metadata, calls provisioner:
   ```
   POST http://127.0.0.1:3050/provision
   Authorization: Bearer <PROVISION_API_SECRET>
   { slug, plan, email }
   ```
5. **provisioner/provision.js**:
   - Creates `/opt/teamdock/tenants/{slug}/`
   - Assigns next available port (starting at 3100, atomic file lock)
   - Generates all secrets (`AUTH_SECRET`, `SESSION_ENCRYPTION_KEY`, DB passwords, etc.)
   - Writes `docker-compose.yml` + `.env.secrets` (mode 0600)
   - `docker compose up -d` (uses `ghcr.io/teamdock/woo-client:latest`)
   - Waits for MariaDB healthcheck (up to 60 s), seeds `magic_token` into `settings` table
   - Writes nginx vhost to `/etc/nginx/sites-available/{slug}.teamdock.ai.conf`
   - Symlinks to `sites-enabled/`, reloads nginx
   - Sends welcome email with setup link
6. Tenant is live at `https://{slug}.teamdock.ai`.

Wildcard SSL (`*.teamdock.ai`) is obtained once (01-wildcard-ssl.sh) and
covers all new tenants automatically — no per-tenant certbot needed.

## Plans

| Plan    | Price   | priceId env var            |
|---------|---------|----------------------------|
| Starter | €49/mo  | `STRIPE_PRICE_STARTER`     |
| Growth  | €99/mo  | `STRIPE_PRICE_GROWTH`      |
| Pro     | €199/mo | `STRIPE_PRICE_PRO`         |

## Environment Variables

### SvelteKit app (src/)

| Variable               | Where set        | Purpose                                 |
|------------------------|------------------|-----------------------------------------|
| `STRIPE_SECRET_KEY`    | private env      | Stripe API key                          |
| `STRIPE_WEBHOOK_SECRET`| private env      | Verify Stripe webhook signatures        |
| `STRIPE_PRICE_STARTER` | private env      | Stripe price ID for Starter plan        |
| `STRIPE_PRICE_GROWTH`  | private env      | Stripe price ID for Growth plan         |
| `STRIPE_PRICE_PRO`     | private env      | Stripe price ID for Pro plan            |
| `PROVISION_API_URL`    | private env      | URL of provisioner (`http://127.0.0.1:3050/provision`) |
| `PROVISION_API_SECRET` | private env      | Bearer token for provisioner API        |
| `PUBLIC_BASE_URL`      | public env       | Base URL for Stripe success/cancel URLs |

### Provisioner (provisioner/.env)

| Variable               | Purpose                                      |
|------------------------|----------------------------------------------|
| `PROVISION_API_SECRET` | Must match the SvelteKit app's value         |
| `PROVISIONER_PORT`     | Port for provisioner HTTP server (default 3050) |
| `TENANTS_DIR`          | Where tenant dirs are created (default `/opt/teamdock/tenants`) |
| `NGINX_DIR`            | nginx sites-available dir                    |
| `DOMAIN`               | Tenant domain (default `teamdock.ai`)        |
| `APP_IMAGE`            | Docker image to pull for each tenant         |
| `SMTP_*`               | Email credentials for welcome emails         |

## Development

```bash
# SvelteKit dev server
npm install
npm run dev        # http://localhost:5174

# Type checking
npm run check

# Build
npm run build
```

The provisioner is only useful on the actual Hetzner server (it calls `docker compose`
and writes to `/etc/nginx`). It is not run locally.

## CI/CD

`.github/workflows/docker.yml` — on push to `main`:
- Builds the SvelteKit app Docker image (`node:22-alpine`, adapter-node)
- Pushes to GHCR as `ghcr.io/{owner}/workflow-saas:latest`

The provisioner is deployed separately (it runs as a long-lived process on the
Hetzner host, not in a container).

## Tenant Resource Limits (per tenant Compose)

| Resource | App container | DB container |
|----------|---------------|--------------|
| Memory   | 512 MB        | 256 MB       |
| CPU      | 0.5 cores     | 0.25 cores   |

## Production Server — Hetzner (91.99.103.153, Ubuntu 24.04)

### Directory layout

```
/opt/teamdock/
  app-src/           ← woo_client_codex git clone (the TENANT app)
  frontend-src/      ← workflow-saas git clone (THIS repo — provisioner lives here)
    provisioner/
      server.js
      provision.js
      .env           ← provisioner secrets (SMTP, PROVISION_API_SECRET, CERT_NAME, …)
  tenants/
    {slug}/
      docker-compose.yml
      .env.secrets   ← auto-generated per tenant (DB passwords, AUTH_SECRET, SMTP, …)
  frontend/          ← built workflow-saas SvelteKit static output
  backups/
    YYYY-MM-DD/
      {slug}.sql.gz  ← nightly MariaDB dumps (kept 14 days)
```

### Critical: two repos, one server

| Path | Git remote | Purpose |
|------|-----------|---------|
| `/opt/teamdock/app-src` | `workflow` (woo_client_codex) | Source for `workflow_portal-app:latest` Docker image |
| `/opt/teamdock/frontend-src` | `workflow-saas` (this repo) | Provisioner process + SvelteKit marketing site |

**Always build the tenant Docker image from `/opt/teamdock/app-src`, never from `frontend-src`.**
Running `docker build` in `frontend-src` builds the marketing site and overwrites the tenant image — breaking all tenant containers.

### Updating the tenant app image

```bash
cd /opt/teamdock/app-src
git pull origin main
docker build -t workflow_portal-app:latest .

# Recreate all tenant app containers (DB volumes untouched)
for tenant in /opt/teamdock/tenants/*/; do
  slug=$(basename "$tenant")
  [[ "$slug" == .* ]] && continue
  docker compose -f "$tenant/docker-compose.yml" up -d --no-deps --force-recreate app
done
```

### Updating the provisioner

```bash
cd /opt/teamdock/frontend-src
git pull origin main
pm2 restart teamdock-provisioner --update-env
```

### PM2

The provisioner runs as PM2 process **`teamdock-provisioner`** (id 0).
Logs: `pm2 logs teamdock-provisioner --lines 200 --nostream`

### SSL certificate

Wildcard cert is at `/etc/letsencrypt/live/teamdock.ai-0001/` (note the `-0001` suffix —
certbot appended it on renewal). The provisioner `.env` must have:
```
CERT_NAME=teamdock.ai-0001
```
Without this the generated nginx vhosts point to the wrong cert path and all new tenants fail to serve HTTPS.

### SMTP propagation

The provisioner reads `SMTP_*` from its own `.env` and writes them into each tenant's
`.env.secrets` at provision time. This lets the tenant app send resend-magic emails.
If a tenant was provisioned before this was in place, manually append to their `.env.secrets`:

```bash
SMTP_HOST=$(grep ^SMTP_HOST /opt/teamdock/frontend-src/provisioner/.env | cut -d= -f2-)
SMTP_PORT=$(grep ^SMTP_PORT /opt/teamdock/frontend-src/provisioner/.env | cut -d= -f2-)
SMTP_SECURE=$(grep ^SMTP_SECURE /opt/teamdock/frontend-src/provisioner/.env | cut -d= -f2-)
SMTP_USER=$(grep ^SMTP_USER /opt/teamdock/frontend-src/provisioner/.env | cut -d= -f2-)
SMTP_PASS=$(grep ^SMTP_PASS /opt/teamdock/frontend-src/provisioner/.env | cut -d= -f2-)
SMTP_FROM=$(grep ^SMTP_FROM /opt/teamdock/frontend-src/provisioner/.env | cut -d= -f2-)

printf "SMTP_HOST=%s\nSMTP_PORT=%s\nSMTP_SECURE=%s\nSMTP_USER=%s\nSMTP_PASS=%s\nSMTP_FROM=%s\nPUBLIC_BASE_URL=https://{slug}.teamdock.ai\n" \
  "$SMTP_HOST" "$SMTP_PORT" "$SMTP_SECURE" "$SMTP_USER" "$SMTP_PASS" "$SMTP_FROM" \
  >> /opt/teamdock/tenants/{slug}/.env.secrets
docker compose -f /opt/teamdock/tenants/{slug}/docker-compose.yml up -d --no-deps app
```

### Nightly backups

Cron: `0 2 * * * /opt/teamdock/frontend-src/provisioner/backup.sh`
Dumps all tenant DBs to `/opt/teamdock/backups/YYYY-MM-DD/{slug}.sql.gz`, keeps 14 days.

### Manually recovering a broken tenant

If provisioning failed mid-way (settings table never seeded):
1. Check the provisioner logs: `pm2 logs teamdock-provisioner --lines 200 --nostream`
2. Verify migrations ran: `docker exec {slug}-db-1 mariadb -u root -p"$ROOT_PASS" teamdock_{slug} -e "SHOW TABLES;"`
3. If table exists, seed manually:
   ```sql
   INSERT INTO settings (id, config, setup_complete, magic_token, magic_token_exp, admin_email)
   VALUES (1, '{}', 0, 'placeholder', 0, 'admin@example.com')
   ON DUPLICATE KEY UPDATE config=config;
   ```
4. Trigger resend: `curl -X POST https://{slug}.teamdock.ai/api/auth/resend-magic -H "Content-Type: application/json" -d '{"email":"admin@example.com"}'`
5. If nginx vhost is missing: generate from template and symlink to sites-enabled, then `nginx -s reload`.

## Important Notes

- The provisioner uses an **atomic spin-lock** on a `.port-counter.lock` file to
  prevent port collisions when two tenants are provisioned simultaneously.
- Secrets are written to `.env.secrets` with mode `0600` (not in `docker-compose.yml`).
- `pull_policy: never` in the Compose template — the image must already be present
  on the host; build it from `/opt/teamdock/app-src`.
- The `magic_token` seeded into `settings` expires after 14 days; it's the
  admin's one-time setup credential. The provisioner waits up to 4.5 min (90×3s)
  for the `settings` table to appear (migrations run inside the app container on startup).
- Do not `source` the provisioner `.env` in bash scripts — `SMTP_FROM` contains
  angle brackets (`<noreply@...>`) which bash treats as redirection. Use `cut -d= -f2-` instead.
