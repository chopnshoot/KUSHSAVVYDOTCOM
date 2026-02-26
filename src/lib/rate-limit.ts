import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

/**
 * Check rate limit for an AI tool API request.
 * Returns { success, remaining, limit } or null if rate limiting is not configured.
 * When not configured (no env vars), all requests are allowed.
 */
export async function checkRateLimit(request: NextRequest): Promise<{
  success: boolean;
  remaining: number;
  limit: number;
} | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null; // Rate limiting not configured — allow all requests
  }

  const redis = new Redis({ url, token });

  // Check if this is a subscriber (higher limit)
  const subscriberCookie = request.cookies.get("ks_subscriber");
  const isSubscriber = !!subscriberCookie?.value;
  const limit = isSubscriber ? 30 : 10;

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, "24 h"),
    analytics: true,
    prefix: "kushsavvy:ratelimit",
  });

  // Use subscriber hash as identifier if available, otherwise IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const identifier = isSubscriber ? `sub:${subscriberCookie.value}` : `ip:${ip}`;

  const result = await ratelimit.limit(identifier);

  return {
    success: result.success,
    remaining: result.remaining,
    limit,
  };
}
