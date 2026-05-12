#!/bin/bash
# ── Wildcard SSL certificate for *.nemofirm.com ───────────────────────────────
# Run this ONCE on the Hetzner server.
# Requires: certbot, your DNS provider access to add a TXT record.
#
# Usage: bash deploy/01-wildcard-ssl.sh

set -euo pipefail
DOMAIN="nemofirm.com"

echo "==> Installing certbot..."
apt-get update -q
apt-get install -y certbot python3-certbot-nginx

echo ""
echo "==> Requesting wildcard certificate for *.${DOMAIN} and ${DOMAIN}"
echo "    You will be asked to add a DNS TXT record to prove domain ownership."
echo "    Log into your DNS provider and add the record when prompted."
echo ""

certbot certonly \
  --manual \
  --preferred-challenges dns \
  --agree-tos \
  --no-eff-email \
  -d "${DOMAIN}" \
  -d "*.${DOMAIN}"

echo ""
echo "✅ Certificate issued at /etc/letsencrypt/live/${DOMAIN}/"
echo ""
echo "==> Setting up auto-renewal..."
# Test renewal (dry run)
certbot renew --dry-run

# Add cron for auto-renewal (runs twice a day)
(crontab -l 2>/dev/null; echo "0 3,15 * * * certbot renew --quiet --post-hook 'nginx -s reload'") | crontab -

echo "✅ Auto-renewal configured via cron."
