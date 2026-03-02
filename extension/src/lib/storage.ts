import type { UserPreferences, ExtensionStorage, CachedInsight } from "./types";

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const DAILY_LIMIT = 50;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function cacheKey(name: string, category: string): string {
  return `${name.toLowerCase().replace(/\s+/g, "_")}:${category}`;
}

// ─── Installation ID ──────────────────────────────────────────────────────────

export async function getInstallationId(): Promise<string> {
  const result = await chrome.storage.local.get("installationId");
  if (result.installationId) return result.installationId as string;

  // Generate a random UUID-like ID
  const id = `ks_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  await chrome.storage.local.set({ installationId: id });
  return id;
}

// ─── Preferences ─────────────────────────────────────────────────────────────

export async function getPreferences(): Promise<UserPreferences | null> {
  const result = await chrome.storage.local.get("preferences");
  return (result.preferences as UserPreferences) ?? null;
}

export async function savePreferences(prefs: UserPreferences): Promise<void> {
  await chrome.storage.local.set({ preferences: prefs });
}

// ─── Age Verification ─────────────────────────────────────────────────────────

export async function isAgeVerified(): Promise<boolean> {
  const result = await chrome.storage.local.get("ageVerified");
  return (result.ageVerified as boolean) ?? false;
}

export async function setAgeVerified(verified: boolean): Promise<void> {
  await chrome.storage.local.set({ ageVerified: verified });
}

// ─── Insight Cache ─────────────────────────────────────────────────────────

export async function getCachedInsight(
  name: string,
  category: string
): Promise<CachedInsight | null> {
  const key = cacheKey(name, category);
  const result = await chrome.storage.local.get("cachedInsights");
  const cache = (result.cachedInsights ?? {}) as Record<string, CachedInsight>;
  const entry = cache[key];
  if (!entry) return null;

  const age = Date.now() - entry.cachedAt;
  if (age > entry.ttl) {
    // Expired — prune it
    delete cache[key];
    await chrome.storage.local.set({ cachedInsights: cache });
    return null;
  }

  return entry;
}

export async function setCachedInsight(
  name: string,
  category: string,
  data: CachedInsight["data"]
): Promise<void> {
  const key = cacheKey(name, category);
  const result = await chrome.storage.local.get("cachedInsights");
  const cache = (result.cachedInsights ?? {}) as Record<string, CachedInsight>;
  cache[key] = { data, cachedAt: Date.now(), ttl: CACHE_TTL_MS };
  await chrome.storage.local.set({ cachedInsights: cache });
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────

export async function checkLocalRateLimit(): Promise<{
  allowed: boolean;
  remaining: number;
}> {
  const today = todayStr();
  const result = await chrome.storage.local.get(["insightsUsedToday", "insightsResetDate"]);

  const resetDate = result.insightsResetDate as string | undefined;
  let used = (result.insightsUsedToday as number) ?? 0;

  if (resetDate !== today) {
    // New day — reset counter
    used = 0;
    await chrome.storage.local.set({ insightsUsedToday: 0, insightsResetDate: today });
  }

  if (used >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: DAILY_LIMIT - used };
}

export async function incrementInsightCount(): Promise<void> {
  const today = todayStr();
  const result = await chrome.storage.local.get(["insightsUsedToday", "insightsResetDate"]);

  const resetDate = result.insightsResetDate as string | undefined;
  let used = (result.insightsUsedToday as number) ?? 0;

  if (resetDate !== today) used = 0;

  await chrome.storage.local.set({
    insightsUsedToday: used + 1,
    insightsResetDate: today,
  });
}

// ─── Account ──────────────────────────────────────────────────────────────────

export async function getAccountEmail(): Promise<string | null> {
  const result = await chrome.storage.local.get("accountEmail");
  return (result.accountEmail as string) ?? null;
}

export async function setAccountEmail(email: string): Promise<void> {
  await chrome.storage.local.set({ accountEmail: email });
}

export async function clearAll(): Promise<void> {
  await chrome.storage.local.clear();
}
