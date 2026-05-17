#!/bin/bash
# ── Full production deploy for NemoFirm on Hetzner ───────────────────────────
# Run this from the server after first-time git clone.
# Re-run any time to update the frontend or provisioner.
#
# Usage: bash deploy/02-deploy.sh

set -euo pipefail

REPO_DIR="/opt/teamdock/workflow-saas"
TENANTS_DIR="/opt/teamdock/tenants"
NGINX_SITES="/etc/nginx/sites-available"

echo "==> Creating directories..."
mkdir -p "$TENANTS_DIR" "$NGINX_SITES" /etc/nginx/sites-enabled /opt/teamdock

# ── 1. Pull latest code ───────────────────────────────────────────────────────
echo "==> Pulling latest code..."
if [ ! -d "$REPO_DIR" ]; then
  git clone https://github.com/YOUR_GITHUB_USERNAME/workflow-saas.git "$REPO_DIR"
fi
cd "$REPO_DIR"
git pull origin main

# ── 2. Build & start workflow-saas frontend ───────────────────────────────────
echo "==> Building workflow-saas frontend..."
docker build -t teamdock-frontend:latest .
docker stop teamdock-frontend 2>/dev/null || true
docker rm   teamdock-frontend 2>/dev/null || true
docker run -d \
  --name teamdock-frontend \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  --env-file .env \
  teamdock-frontend:latest

echo "✅ Frontend running on 127.0.0.1:3000"

# ── 3. Start provisioner ──────────────────────────────────────────────────────
echo "==> Starting provisioner..."
cd "$REPO_DIR/provisioner"

if [ ! -f .env ]; then
  echo "ERROR: provisioner/.env not found. Copy .env.example and fill it in."
  exit 1
fi

npm install --omit=dev
docker stop teamdock-provisioner 2>/dev/null || true
docker rm   teamdock-provisioner 2>/dev/null || true

# Run provisioner directly with node (needs host Docker socket + nginx access)
# Use PM2 for process management
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi
pm2 delete teamdock-provisioner 2>/dev/null || true
pm2 start server.js --name teamdock-provisioner --cwd "$REPO_DIR/provisioner"
pm2 save

echo "✅ Provisioner running on 127.0.0.1:3050"

# ── 4. Install nginx config for teamdock.com ──────────────────────────────────
echo "==> Configuring nginx..."
cp "$REPO_DIR/deploy/nginx-teamdock.conf" "$NGINX_SITES/teamdock.com.conf"
ln -sf "$NGINX_SITES/teamdock.com.conf" /etc/nginx/sites-enabled/teamdock.com.conf

cp "$REPO_DIR/deploy/setup-pending.html" /opt/teamdock/setup-pending.html
nginx -t && nginx -s reload
echo "✅ nginx configured and reloaded"

# ── 5. Set up Stripe webhook secret ──────────────────────────────────────────
echo ""
echo "==> NEXT STEPS:"
echo "  1. Make sure .env has STRIPE_WEBHOOK_SECRET set."
echo "     Get it from: https://dashboard.stripe.com/webhooks"
echo "     Webhook endpoint: https://teamdock.com/api/webhook"
echo "     Events to listen for: checkout.session.completed"
echo ""
echo "  2. If not done yet, run wildcard SSL:"
echo "     bash deploy/01-wildcard-ssl.sh"
echo ""
echo "✅ Deploy complete! teamdock.com is live."
