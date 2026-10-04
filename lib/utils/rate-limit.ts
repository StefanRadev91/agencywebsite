const hits = new Map<string, number[]>();

/**
 * Simple in-memory sliding-window limiter. It is per server instance, so on serverless
 * platforms it only slows bursts; the honeypot and validation do the rest. No database by design.
 */
export function rateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false as const, retryAfter: Math.ceil((windowMs - (now - recent[0]!)) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound.
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return { ok: true as const };
}

export const resetRateLimit = () => hits.clear();
