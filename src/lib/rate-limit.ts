/**
 * Rate limiting utility using Upstash Redis
 * For production deployment on Vercel with multiple serverless instances
 *
 * To use:
 * 1. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to Vercel env vars
 * 2. Import and use rateLimit() in API routes
 */

import { Redis } from "@upstash/redis";

// Lazy initialization to avoid build-time errors
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("Upstash Redis not configured - rate limiting will use in-memory fallback");
    return null;
  }

  try {
    redis = new Redis({ url, token });
    return redis;
  } catch (error) {
    console.error("Failed to initialize Upstash Redis:", error);
    return null;
  }
}

export interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
  keyPrefix?: string;    // Prefix for Redis keys
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

/**
 * Rate limit using Upstash Redis (distributed)
 * Falls back to in-memory if Redis not configured
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redisClient = getRedis();
  const keyPrefix = config.keyPrefix || "ratelimit";
  const key = `${keyPrefix}:${identifier}`;
  const windowSec = Math.ceil(config.windowMs / 1000);
  const now = Date.now();
  const resetAt = now + config.windowMs;

  if (redisClient) {
    try {
      // Use Redis sliding window with sorted set
      const pipeline = redisClient.pipeline();

      // Remove expired entries
      pipeline.zremrangebyscore(key, 0, now - config.windowMs);

      // Count current requests
      pipeline.zcard(key);

      // Add current request
      pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });

      // Set expiry
      pipeline.expire(key, windowSec);

      const results = await pipeline.exec();
      const currentCount = (results[1] as number) || 0;

      if (currentCount >= config.maxRequests) {
        return {
          success: false,
          limit: config.maxRequests,
          remaining: 0,
          resetAt,
          retryAfter: windowSec,
        };
      }

      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - currentCount - 1,
        resetAt,
      };
    } catch (error) {
      console.error("Redis rate limit error, falling back to in-memory:", error);
      // Fall through to in-memory
    }
  }

  // In-memory fallback (per-instance only)
  // Note: This won't work correctly across multiple serverless instances
  const globalWithMap = globalThis as typeof globalThis & {
    __rateLimitMap?: Map<string, { count: number; resetAt: number }>;
  };

  if (!globalWithMap.__rateLimitMap) {
    globalWithMap.__rateLimitMap = new Map<string, { count: number; resetAt: number }>();
  }

  const hits = globalWithMap.__rateLimitMap;
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  entry.count += 1;
  if (entry.count > config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Create rate limit middleware for API routes
 */
export function createRateLimiter(config: RateLimitConfig) {
  return async (identifier: string): Promise<RateLimitResult> => {
    return rateLimit(identifier, config);
  };
}

// Pre-configured rate limiters
export const apiRateLimiter = createRateLimiter({
  windowMs: 60_000, // 1 minute
  maxRequests: 60,
  keyPrefix: "api",
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60_000, // 15 minutes
  maxRequests: 10,
  keyPrefix: "auth",
});

export const checkoutRateLimiter = createRateLimiter({
  windowMs: 60_000, // 1 minute
  maxRequests: 20,
  keyPrefix: "checkout",
});

export const quizRateLimiter = createRateLimiter({
  windowMs: 60_000, // 1 minute
  maxRequests: 30,
  keyPrefix: "quiz",
});