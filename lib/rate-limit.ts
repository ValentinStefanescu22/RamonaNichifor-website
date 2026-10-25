// ponytail: per-instance memory, move to Postgres if Strix (M5) shows bypass across instances
const hits = new Map<string, number[]>();

/** Sliding window: true when `key` may go ahead (and the hit is counted), false once it had `max` hits in the last `windowMs`. */
export function rateLimit(key: string, max = 5, windowMs = 600_000, now = Date.now()): boolean {
  if (hits.size > 10_000) for (const [k, t] of hits) if (t[t.length - 1] <= now - windowMs) hits.delete(k);
  const recent = (hits.get(key) ?? []).filter((t) => t > now - windowMs);
  const ok = recent.length < max;
  if (ok) recent.push(now);
  hits.set(key, recent);
  return ok;
}
