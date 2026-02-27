import { Redis } from "@upstash/redis";
import { nanoid } from "nanoid";

const RESULT_TTL = 60 * 60 * 24 * 90; // 90 days

export interface StoredResult {
  tool: string;
  input: Record<string, unknown>;
  output: string;
  createdAt: string;
  meta: {
    title: string;
    description: string;
    shareText: string;
  };
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function storeResult(data: Omit<StoredResult, "createdAt">): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;

  const hash = nanoid(8);
  const key = `result:${data.tool}:${hash}`;

  const stored: StoredResult = {
    ...data,
    createdAt: new Date().toISOString(),
  };

  await redis.set(key, JSON.stringify(stored), { ex: RESULT_TTL });
  return hash;
}

export async function getResult(tool: string, hash: string): Promise<StoredResult | null> {
  const redis = getRedis();
  if (!redis) return null;

  const key = `result:${tool}:${hash}`;
  const data = await redis.get<string>(key);
  if (!data) return null;

  return typeof data === "string" ? JSON.parse(data) : data;
}

/** Deduplication for strain comparisons — saves API costs */
export async function findExistingComparison(strain1: string, strain2: string) {
  const redis = getRedis();
  if (!redis) return null;

  const [a, b] = [strain1, strain2].sort();
  const lookupKey = `comparison-lookup:${a.toLowerCase()}:${b.toLowerCase()}`;
  const existingHash = await redis.get<string>(lookupKey);

  if (existingHash) {
    const result = await getResult("strain-compare", existingHash);
    if (result) return { hash: existingHash, result };
  }

  return null;
}

export async function storeComparisonResult(
  strain1: string,
  strain2: string,
  data: Omit<StoredResult, "createdAt">
): Promise<string | null> {
  const hash = await storeResult(data);
  if (!hash) return null;

  const redis = getRedis();
  if (!redis) return hash;

  const [a, b] = [strain1, strain2].sort();
  const lookupKey = `comparison-lookup:${a.toLowerCase()}:${b.toLowerCase()}`;
  await redis.set(lookupKey, hash, { ex: RESULT_TTL });

  return hash;
}

/** Get all result keys for sitemap generation */
export async function getResultKeys(tool: string, limit = 1000): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return [];

  const keys = await redis.keys(`result:${tool}:*`);
  return keys.slice(0, limit).map((key) => key.split(":").pop() || "");
}
