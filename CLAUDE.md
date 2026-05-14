# workflow-saas

The **SaaS billing and provisioning layer** for NemoFirm. This is the
public-facing marketing site and Stripe checkout that, on successful payment,
automatically provisions a new isolated tenant workspace running `woo_client_codex`.

## How it all fits together

```
User visits nemofirm.com (this repo — workflow-saas)
  └─▶ picks plan → /register → Stripe Checkout
        └─▶ checkout.session.completed webhook
              └─▶ /api/webhook → calls provisioner HTTP API
                    └─▶ provisioner/server.js (runs on Hetzner at 127.0.0.1:3050)
                          └─▶ docker compose up  (woo_client_codex image)
                                └─▶ {slug}.nemofirm.com goes live
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
  01-wildcard-ssl.sh      set up *.nemofirm.com wildcard cert
  02-deploy.sh            deploy script
  nginx-nemofirm.conf     top-level nginx config
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
   - Creates `/opt/nemofirm/tenants/{slug}/`
   - Assigns next available port (starting at 3100, atomic file lock)
   - Generates all secrets (`AUTH_SECRET`, `SESSION_ENCRYPTION_KEY`, DB passwords, etc.)
   - Writes `docker-compose.yml` + `.env.secrets` (mode 0600)
   - `docker compose up -d` (uses `ghcr.io/nemofirm/woo-client:latest`)
   - Waits for MariaDB healthcheck (up to 60 s), seeds `magic_token` into `settings` table
   - Writes nginx vhost to `/etc/nginx/sites-available/{slug}.nemofirm.com.conf`
   - Symlinks to `sites-enabled/`, reloads nginx
   - Sends welcome email with setup link
6. Tenant is live at `https://{slug}.nemofirm.com`.

Wildcard SSL (`*.nemofirm.com`) is obtained once (01-wildcard-ssl.sh) and
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
| `TENANTS_DIR`          | Where tenant dirs are created (default `/opt/nemofirm/tenants`) |
| `NGINX_DIR`            | nginx sites-available dir                    |
| `DOMAIN`               | Tenant domain (default `nemofirm.com`)       |
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

## Important Notes

- The provisioner uses an **atomic spin-lock** on a `.port-counter.lock` file to
  prevent port collisions when two tenants are provisioned simultaneously.
- Secrets are written to `.env.secrets` with mode `0600` (not in `docker-compose.yml`).
- `pull_policy: never` in the Compose template — the image must already be
  present on the host (pulled separately or built locally).
- The `magic_token` seeded into `settings` expires after 14 days; it's the
  admin's one-time setup credential.
