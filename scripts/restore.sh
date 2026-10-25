#!/bin/sh
# Restores a backup made by scripts/backup.sh into a database.
# Usage: scripts/restore.sh <dump-file> <target-database-uri> [--yes-overwrite-live]
# Refuses to restore over the live database (DATABASE_URI, env or .env.local) without --yes-overwrite-live.
set -eu

cd "$(dirname "$0")/.."

usage="usage: scripts/restore.sh <dump-file> <target-database-uri> [--yes-overwrite-live]"
[ $# -ge 2 ] && [ $# -le 3 ] || { echo "$usage" >&2; exit 2; }
dump=$1 target=$2 flag=${3:-}
[ -z "$flag" ] || [ "$flag" = "--yes-overwrite-live" ] || { echo "$usage" >&2; exit 2; }
[ -f "$dump" ] || { echo "restore: no such dump file: $dump" >&2; exit 2; }

[ -n "${DATABASE_URI:-}" ] ||
  DATABASE_URI=$(sed -n 's/^DATABASE_URI=//p' .env.local 2>/dev/null | tail -n 1 | tr -d "\"'")

# Same database = same URI, or the same server + database name when both answer
# (catches postgres://localhost/db vs postgres://localhost:5432/db).
# Loopback and the Unix socket count as one host ("local"), so localhost via ::1 or 127.0.0.1 match too.
ident() {
  psql "$1" -Atc "select current_database() || '@' || case when inet_server_addr() is null or host(inet_server_addr()) in ('127.0.0.1', '::1') then 'local' else host(inet_server_addr()) end || ':' || current_setting('port')" 2>/dev/null ||
    echo "uri:$1"
}
if [ -n "${DATABASE_URI:-}" ] && [ "$flag" != "--yes-overwrite-live" ]; then
  if [ "$target" = "$DATABASE_URI" ] || [ "$(ident "$target")" = "$(ident "$DATABASE_URI")" ]; then
    echo "restore: the target is the live database (DATABASE_URI); pass --yes-overwrite-live to really overwrite it" >&2
    exit 3
  fi
fi

pg_restore --clean --if-exists --no-owner --no-privileges -d "$target" "$dump"

tables=$(psql "$target" -Atc "select count(*) from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE'")
echo "restore: $dump restored, $tables tables in public"
