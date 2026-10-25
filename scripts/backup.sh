#!/bin/sh
# Nightly database backup (spec §9 "Data safety").
# Dumps DATABASE_URI to backups/ramona-<UTC timestamp>.dump and keeps the 30 newest dumps locally.
# When S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY are all set, it also uploads
# the dump to s3://$S3_BUCKET/backups/ (Cloudflare R2) and deletes remote backups older than 30 days.
# (An R2 lifecycle rule on the backups/ prefix would do the same pruning server side; this script
# keeps it here so the retention lives in the repo.)
#
# Media is not dumped: in production it lives in R2, which keeps it on its own; locally media/ stays on disk.
#
# Usage: scripts/backup.sh            (DATABASE_URI from the environment, else from .env.local)
set -eu

cd "$(dirname "$0")/.."

[ -n "${DATABASE_URI:-}" ] ||
  DATABASE_URI=$(sed -n 's/^DATABASE_URI=//p' .env.local 2>/dev/null | tail -n 1 | tr -d "\"'")
[ -n "$DATABASE_URI" ] || { echo "backup: DATABASE_URI is not set (env or .env.local)" >&2; exit 1; }

# Upload only with all four S3 variables; a partial set is a misconfiguration, not "local only".
s3_set=0
for v in "${S3_BUCKET:-}" "${S3_ENDPOINT:-}" "${S3_ACCESS_KEY_ID:-}" "${S3_SECRET_ACCESS_KEY:-}"; do
  [ -n "$v" ] && s3_set=$((s3_set + 1))
done
if [ "$s3_set" -ne 0 ] && [ "$s3_set" -ne 4 ]; then
  echo "backup: set all of S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, or none" >&2
  exit 1
fi
if [ "$s3_set" -eq 4 ] && ! command -v aws >/dev/null 2>&1; then
  echo "backup: S3 variables are set but the aws CLI is not installed" >&2
  exit 1
fi

mkdir -p backups
file="backups/ramona-$(date -u +%Y%m%dT%H%M%SZ).dump"
# Dump to .part first, so a failed dump never counts as one of the 30 kept.
trap 'rm -f "$file.part"' EXIT
pg_dump --format=custom --no-owner --no-privileges "$DATABASE_URI" -f "$file.part"
mv "$file.part" "$file"

# Keep the 30 newest local dumps (names sort by time).
ls backups/ramona-*.dump | sort -r | tail -n +31 | while read -r old; do rm -f "$old"; done

if [ "$s3_set" -eq 4 ]; then
  export AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID" AWS_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY"
  export AWS_DEFAULT_REGION=auto
  # R2 rejects the newer default checksum headers of AWS CLI v2.23+
  export AWS_REQUEST_CHECKSUM_CALCULATION=when_required AWS_RESPONSE_CHECKSUM_VALIDATION=when_required
  aws s3 cp --endpoint-url "$S3_ENDPOINT" --only-show-errors "$file" "s3://$S3_BUCKET/backups/"
  echo "uploaded: s3://$S3_BUCKET/backups/$(basename "$file")"

  cutoff=$(date -u -d '30 days ago' +%Y-%m-%d 2>/dev/null || date -u -v-30d +%Y-%m-%d)
  aws s3 ls --endpoint-url "$S3_ENDPOINT" "s3://$S3_BUCKET/backups/" |
    awk -v c="$cutoff" '$1 < c && $4 ~ /^ramona-.*\.dump$/ { print $4 }' |
    while read -r old; do
      aws s3 rm --endpoint-url "$S3_ENDPOINT" --only-show-errors "s3://$S3_BUCKET/backups/$old"
      echo "pruned: s3://$S3_BUCKET/backups/$old"
    done
fi

echo "backup: $file ($(du -h "$file" | cut -f1 | tr -d ' '))"
