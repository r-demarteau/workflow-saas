#!/bin/bash
# ── Full production deploy for NemoFirm on Hetzner ───────────────────────────
# Run this from the server after first-time git clone.
# Re-run any time to update the frontend or provisioner.
#
# Usage: bash deploy/02-deploy.sh

set -euo pipefail

REPO_DIR="/opt/nemofirm/workflow-saas"
TENANTS_DIR="/opt/nemofirm/tenants"
NGINX_SITES="/etc/nginx/sites-available"

echo "==> Creating directories..."
mkdir -p "$TENANTS_DIR" "$NGINX_SITES" /etc/nginx/sites-enabled

# ── 1. Pull latest code ───────────────────────────────────────────────────────
echo "==> Pulling latest code..."
if [ ! -d "$REPO_DIR" ]; then
  git clone https://github.com/YOUR_GITHUB_USERNAME/workflow-saas.git "$REPO_DIR"
fi
cd "$REPO_DIR"
git pull origin main

# ── 2. Build & start workflow-saas frontend ───────────────────────────────────
echo "==> Building workflow-saas frontend..."
docker build -t nemofirm-frontend:latest .
docker stop nemofirm-frontend 2>/dev/null || true
docker rm   nemofirm-frontend 2>/dev/null || true
docker run -d \
  --name nemofirm-frontend \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  --env-file .env \
  nemofirm-frontend:latest

echo "✅ Frontend running on 127.0.0.1:3000"

# ── 3. Start provisioner ──────────────────────────────────────────────────────
echo "==> Starting provisioner..."
cd "$REPO_DIR/provisioner"

if [ ! -f .env ]; then
  echo "ERROR: provisioner/.env not found. Copy .env.example and fill it in."
  exit 1
fi

npm install --omit=dev
docker stop nemofirm-provisioner 2>/dev/null || true
docker rm   nemofirm-provisioner 2>/dev/null || true

# Run provisioner directly with node (needs host Docker socket + nginx access)
# Use PM2 for process management
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi
pm2 delete nemofirm-provisioner 2>/dev/null || true
pm2 start server.js --name nemofirm-provisioner --cwd "$REPO_DIR/provisioner"
pm2 save

echo "✅ Provisioner running on 127.0.0.1:3050"

# ── 4. Install nginx config for nemofirm.com ──────────────────────────────────
echo "==> Configuring nginx..."
cp "$REPO_DIR/deploy/nginx-nemofirm.conf" "$NGINX_SITES/nemofirm.com.conf"
ln -sf "$NGINX_SITES/nemofirm.com.conf" /etc/nginx/sites-enabled/nemofirm.com.conf

nginx -t && nginx -s reload
echo "✅ nginx configured and reloaded"

# ── 5. Set up Stripe webhook secret ──────────────────────────────────────────
echo ""
echo "==> NEXT STEPS:"
echo "  1. Make sure .env has STRIPE_WEBHOOK_SECRET set."
echo "     Get it from: https://dashboard.stripe.com/webhooks"
echo "     Webhook endpoint: https://nemofirm.com/api/webhook"
echo "     Events to listen for: checkout.session.completed"
echo ""
echo "  2. If not done yet, run wildcard SSL:"
echo "     bash deploy/01-wildcard-ssl.sh"
echo ""
echo "✅ Deploy complete! nemofirm.com is live."
