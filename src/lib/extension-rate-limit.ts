import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

// Extension-specific rate limiting — separate from site rate limits.
// Uses installationId (anonymous UUID stored in chrome.storage) rather than IP,
// so multiple users on the same network don't conflict.

const INSIGHTS_DAILY_LIMIT = 50; // abuse prevention only — generous for real users
const COA_DAILY_LIMIT = 5; // COA uses Tier 2 (Claude Sonnet) — more expensive

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function checkExtensionRateLimit(
  installationId: string,
  type: "insight" | "coa"
): Promise<{ success: boolean; remaining: number; limit: number } | null> {
  const redis = getRedis();
  if (!redis) return null; // Not configured — allow all

  const limit = type === "insight" ? INSIGHTS_DAILY_LIMIT : COA_DAILY_LIMIT;
  const prefix = `kushsavvy:ext:${type}`;

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, "24 h"),
    analytics: true,
    prefix,
  });

  // Validate installationId format (prevent injection)
  const safeId = installationId.replace(/[^a-z0-9_]/gi, "").slice(0, 64);
  const identifier = `install:${safeId}`;

  const result = await ratelimit.limit(identifier);

  return {
    success: result.success,
    remaining: result.remaining,
    limit,
  };
}

// Server-side insight cache: key = insight:{normalizedName}:{category}
// TTL: 24h — strain data doesn't change
export async function getCachedInsight(
  name: string,
  category: string
): Promise<Record<string, unknown> | null> {
  const redis = getRedis();
  if (!redis) return null;

  const key = `insight:${name.toLowerCase().replace(/\s+/g, "_")}:${category}`;
  const cached = await redis.get<Record<string, unknown>>(key);
  return cached ?? null;
}

export async function setCachedInsight(
  name: string,
  category: string,
  data: Record<string, unknown>
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const key = `insight:${name.toLowerCase().replace(/\s+/g, "_")}:${category}`;
  await redis.setex(key, 24 * 60 * 60, JSON.stringify(data));
}
