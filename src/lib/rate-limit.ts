import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// In-memory fallback for local dev (no Redis required)
// ---------------------------------------------------------------------------
interface MemEntry { count: number; resetAt: number }
const memStore = new Map<string, MemEntry>();
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [k, v] of memStore) if (v.resetAt < now) memStore.delete(k);
}, 5 * 60_000);
if (typeof cleanup.unref === "function") cleanup.unref();

function memLimit(key: string, limit: number, windowMs: number): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = memStore.get(key);
  if (!entry || entry.resetAt < now) {
    memStore.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  entry.count++;
  if (entry.count > limit) return { ok: false, remaining: 0, resetAt: entry.resetAt };
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// ---------------------------------------------------------------------------
// Redis-backed limiter (production)
// ---------------------------------------------------------------------------
const useRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

if (!useRedis && process.env.NODE_ENV === "production") {
  console.warn("[rate-limit] UPSTASH not configured — using in-memory fallback (not safe for multi-instance)");
}

const redis = useRedis
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! })
  : null;

function makeRedisLimiter(requests: number, window: Parameters<typeof Ratelimit.slidingWindow>[1]) {
  if (!redis) return null;
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(requests, window), analytics: false });
}

// ---------------------------------------------------------------------------
// Pre-built limiters
// ---------------------------------------------------------------------------
const redisAuth = makeRedisLimiter(5, "15 m");
const redisReset = makeRedisLimiter(3, "1 h");
const redisWrite = makeRedisLimiter(30, "1 m");

// ---------------------------------------------------------------------------
// Public API — same signature as the old rateLimit() so existing call sites work
// ---------------------------------------------------------------------------
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; resetAt: number } {
  return memLimit(key, limit, windowMs);
}

/** Redis-backed auth limiter (login). Falls back to in-memory. */
export async function rateLimitAuth(key: string): Promise<{ ok: boolean }> {
  if (redisAuth) {
    const { success } = await redisAuth.limit(key);
    return { ok: success };
  }
  return rateLimit(`auth:${key}`, 5, 15 * 60_000);
}

/** Redis-backed password reset limiter. Falls back to in-memory. */
export async function rateLimitReset(key: string): Promise<{ ok: boolean }> {
  if (redisReset) {
    const { success } = await redisReset.limit(key);
    return { ok: success };
  }
  return rateLimit(`reset:${key}`, 3, 60 * 60_000);
}

/** Redis-backed write limiter. Falls back to in-memory. */
export async function rateLimitWrite(key: string): Promise<{ ok: boolean }> {
  if (redisWrite) {
    const { success } = await redisWrite.limit(key);
    return { ok: success };
  }
  return rateLimit(`write:${key}`, 30, 60_000);
}
