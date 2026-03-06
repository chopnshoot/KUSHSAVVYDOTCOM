// ─── V1 Data Layer (Redis-backed) ─────────────────────────────────────────────
// Uses Upstash Redis for V1. The SQL schema in supabase/migrations/ is the
// target Postgres schema once volume justifies the migration.

import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (_redis) return _redis;
  _redis = Redis.fromEnv();
  return _redis;
}

// ─── Key builders ─────────────────────────────────────────────────────────────

export const keys = {
  // canonical product stored by stable hash of (brand+strain+category)
  canonicalProduct: (id: string) => `cp:${id}`,
  // alias lookup: normalized product string → canonical_product_id
  productAlias: (normalized: string) => `alias:product:${normalized}`,
  // alias lookup: normalized strain string → canonical_strain_id
  strainAlias: (normalized: string) => `alias:strain:${normalized}`,
  // canonical strain
  canonicalStrain: (id: string) => `cs:${id}`,
  // consensus score for a product
  consensusScore: (canonicalProductId: string) => `score:consensus:${canonicalProductId}`,
  // personalized score for user × product
  personalizedScore: (deviceId: string, canonicalProductId: string) =>
    `score:personal:${deviceId}:${canonicalProductId}`,
  // captured pages queue for a product (list of capture events)
  capturesForProduct: (canonicalProductId: string) => `captures:${canonicalProductId}`,
  // reviews for a product
  reviewsForProduct: (canonicalProductId: string) => `reviews:${canonicalProductId}`,
};

// ─── TTLs (seconds) ───────────────────────────────────────────────────────────

export const TTL = {
  canonicalProduct: 7 * 24 * 3600,   // 7 days — refresh on new evidence
  consensusScore:   24 * 3600,        // 24 h — recompute daily
  personalizedScore: 6 * 3600,        // 6 h — recompute when profile changes
  userProfile: 90 * 24 * 3600,        // 90 days (per spec)
};

// ─── Normalization helpers ────────────────────────────────────────────────────

export function normalizeName(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").trim();
}

export function canonicalProductKey(
  brandName: string | null | undefined,
  strainName: string | null | undefined,
  category: string
): string {
  const parts = [brandName, strainName, category]
    .map((p) => normalizeName(p ?? "unknown"))
    .join(":");
  return parts;
}
