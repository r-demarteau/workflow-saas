#!/bin/bash
# Daily backup of all tenant MariaDB databases
# Saves compressed dumps to /opt/nemofirm/backups/YYYY-MM-DD/

set -euo pipefail

TENANTS_DIR="${TENANTS_DIR:-/opt/nemofirm/tenants}"
BACKUP_ROOT="/opt/nemofirm/backups"
DATE=$(date +%Y-%m-%d)
BACKUP_DIR="$BACKUP_ROOT/$DATE"
KEEP_DAYS=14

mkdir -p "$BACKUP_DIR"

echo "[backup] Starting backup for $DATE"

for tenant_dir in "$TENANTS_DIR"/*/; do
  slug=$(basename "$tenant_dir")

  # Skip the port counter file
  [[ "$slug" == .* ]] && continue

  secrets_file="$tenant_dir/.env.secrets"
  compose_file="$tenant_dir/docker-compose.yml"

  if [[ ! -f "$secrets_file" || ! -f "$compose_file" ]]; then
    echo "[backup] Skipping $slug — missing files"
    continue
  fi

  # Load secrets
  # shellcheck disable=SC1090
  source <(grep -E '^MYSQL_ROOT_PASSWORD' "$secrets_file")
  # DB name is always nemo_{slug} with hyphens replaced by underscores — same as provision.js
  db_name="nemo_${slug//-/_}"

  # Check container is running
  container="${slug}-db-1"
  if ! docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
    echo "[backup] Skipping $slug — container $container not running"
    continue
  fi

  out="$BACKUP_DIR/${slug}.sql.gz"
  echo "[backup] Dumping $slug ($db_name) → $out"

  docker exec "$container" \
    mariadb-dump -u root -p"${MYSQL_ROOT_PASSWORD}" --single-transaction "$db_name" \
    | gzip > "$out"

  echo "[backup] ✓ $slug"
done

# Prune old backups
find "$BACKUP_ROOT" -maxdepth 1 -type d -mtime "+${KEEP_DAYS}" -exec rm -rf {} + 2>/dev/null || true

echo "[backup] Done. Kept last ${KEEP_DAYS} days."
