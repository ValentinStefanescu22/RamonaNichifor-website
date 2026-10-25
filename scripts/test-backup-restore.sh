#!/bin/sh
# Backup/restore round trip, run locally: backs up the live DB (DATABASE_URI), restores it into a scratch
# database, checks every table has the same row count, then builds and starts the app on the restored DB
# and checks it serves the home (RO + EN) and Payload data from it. The scratch DB is dropped at the end.
# Usage: scripts/test-backup-restore.sh   (needs a local Postgres with createdb/dropdb; port 3105 free)
set -eu

cd "$(dirname "$0")/.."

[ -n "${DATABASE_URI:-}" ] ||
  DATABASE_URI=$(sed -n 's/^DATABASE_URI=//p' .env.local 2>/dev/null | tail -n 1 | tr -d "\"'")
export DATABASE_URI
live_db=$(psql "$DATABASE_URI" -Atc "select current_database()")
scratch="${live_db}_restore"
scratch_uri="postgres://localhost:5432/$scratch"
port=3105
probe=scripts/.probe-restore.tmp.ts

fail() { echo "FAIL: $*" >&2; exit 1; }
stop_server() { pids=$(lsof -ti "tcp:$port" 2>/dev/null || true); [ -z "$pids" ] || kill $pids 2>/dev/null || true; }
cleanup() {
  stop_server
  rm -f "$probe"
  dropdb --if-exists --force "$scratch" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

[ -z "$(lsof -ti "tcp:$port" 2>/dev/null || true)" ] || fail "port $port is already in use"

echo "== 1. backup $live_db"
out=$(scripts/backup.sh) || fail "backup.sh failed"
echo "$out"
dump=$(echo "$out" | sed -n 's/^backup: \(.*\.dump\) (.*/\1/p')
[ -f "$dump" ] || fail "no dump file reported"

echo "== 2. restore guard (live target without the flag must refuse)"
if scripts/restore.sh "$dump" "$DATABASE_URI" 2>/dev/null; then fail "restore.sh overwrote the live DB without --yes-overwrite-live"; fi
if scripts/restore.sh "$dump" "postgres://localhost/$live_db" 2>/dev/null; then fail "restore.sh did not recognise the live DB under another URI"; fi
if scripts/restore.sh "$dump" 2>/dev/null; then fail "restore.sh ran with one argument"; fi
echo "ok: refused"

echo "== 3. restore into $scratch"
dropdb --if-exists --force "$scratch"
createdb "$scratch"
scripts/restore.sh "$dump" "$scratch_uri"

echo "== 4. row counts per table"
counts_sql="select table_name || ' ' || (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I.%I', table_schema, table_name), false, true, '')))[1]::text
  from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name"
psql "$DATABASE_URI" -Atc "$counts_sql" > backups/.counts-live.txt
psql "$scratch_uri" -Atc "$counts_sql" > backups/.counts-restore.txt
tables=$(wc -l < backups/.counts-live.txt | tr -d ' ')
rows=$(awk '{ s += $2 } END { print s }' backups/.counts-live.txt)
diff backups/.counts-live.txt backups/.counts-restore.txt || fail "row counts differ"
rm -f backups/.counts-live.txt backups/.counts-restore.txt
echo "ok: $tables tables, $rows rows, identical counts"

echo "== 5. Payload reads the restored DB"
cat > "$probe" <<'EOF'
import { getPayload } from "payload";
import { sql } from "@payloadcms/db-postgres";
import config from "@payload-config";
const payload = await getPayload({ config });
const db = (await payload.db.drizzle.execute(sql`select current_database() as db`)).rows[0].db;
const { totalDocs } = await payload.count({ collection: "universes" });
console.log(`PROBE db=${db} universes=${totalDocs}`);
process.exit(0);
EOF
probe_out=$(DATABASE_URI="$scratch_uri" npx payload run "$probe" 2>&1 | grep '^PROBE') || fail "payload probe failed"
echo "$probe_out"
[ "$probe_out" = "PROBE db=$scratch universes=4" ] || fail "expected universes=4 from $scratch"

echo "== 6. build + start on the restored DB"
DATABASE_URI="$scratch_uri" npm run build > backups/.build.log 2>&1 || { tail -40 backups/.build.log; fail "build failed"; }
rm -f backups/.build.log
DATABASE_URI="$scratch_uri" PORT=$port npx next start -p "$port" > /dev/null 2>&1 &
i=0
until curl -fs -o /dev/null "http://localhost:$port/"; do
  i=$((i + 1)); [ "$i" -lt 60 ] || fail "server did not start"; sleep 1
done
ro=$(curl -fs "http://localhost:$port/")
en=$(curl -fs "http://localhost:$port/en")
for s in "Povești pentru suflete mici și mari" "Universul Fluturelui"; do
  printf "%s" "$ro" | grep -F "$s" > /dev/null || fail "/ is missing „$s”"
done
for s in "Stories for young and grown-up souls" "The Butterfly Universe"; do
  printf "%s" "$en" | grep -F "$s" > /dev/null || fail "/en is missing \"$s\""
done
echo "ok: / and /en serve the home text"

code=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$port/api/universes?locale=ro")
[ "$code" = 403 ] || fail "/api/universes is publicly readable (HTTP $code)"
media_api=$(curl -fs "http://localhost:$port/api/media?limit=1" | sed -n 's/.*"totalDocs":\([0-9]*\).*/\1/p')
media_db=$(psql "$scratch_uri" -Atc "select count(*) from media")
[ "$media_api" = "$media_db" ] || fail "/api/media totalDocs=$media_api, restored DB has $media_db"
conns=$(psql -d postgres -Atc "select count(*) from pg_stat_activity where datname = '$scratch'")
[ "$conns" -gt 0 ] || fail "the server holds no connection to $scratch"
echo "ok: /api/universes 403, /api/media totalDocs=$media_api matches $scratch, server connected to $scratch ($conns conns)"

stop_server
echo "PASS: backup/restore round trip"
