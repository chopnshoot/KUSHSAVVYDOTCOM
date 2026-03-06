import type { UserProfile, FavoriteEntry, FeedbackEntry, CachedStrainProfile, LegacyUserPreferences } from "./types";

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const DAILY_LIMIT = 50;
const MAX_FEEDBACK_LOG = 200;
const MAX_FAVORITES = 100;

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
  const id = `ks_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  await chrome.storage.local.set({ installationId: id });
  return id;
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function getUserProfile(): Promise<UserProfile | null> {
  const result = await chrome.storage.local.get(["userProfile", "preferences"]);

  // If new profile exists, return it
  if (result.userProfile) return result.userProfile as UserProfile;

  // Migrate from legacy preferences if present
  const legacy = result.preferences as LegacyUserPreferences | undefined;
  if (legacy?.onboardingComplete) {
    const installationId = await getInstallationId();
    const migrated: UserProfile = buildDefaultProfile(installationId);
    migrated.experience_level = (legacy.experienceLevel as UserProfile["experience_level"]) ?? "casual";
    migrated.tolerance_prior = { new: 0.2, casual: 0.4, regular: 0.4, weekly: 0.6, daily: 0.8 }[legacy.experienceLevel] ?? 0.4;
    migrated.onboardingComplete = true;
    await chrome.storage.local.set({ userProfile: migrated });
    return migrated;
  }

  return null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const updated = { ...profile, updatedAt: Date.now() };
  await chrome.storage.local.set({ userProfile: updated });
}

export function buildDefaultProfile(installationId: string): UserProfile {
  return {
    installationId,
    profile_version: "1.0",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    onboardingComplete: false,
    profileBackupEnabled: true,
    experience_level: "casual",
    tolerance_prior: 0.4,
    effect_vector: {},
    avoid_vector: {},
    time_preference: "both",
    preferred_categories: ["flower"],
    potency_preference: "medium",
    potency_target: 0.55,
    flavor_preferences: [],
    terp_preference_vector: {},
    learned_effect_vector: {},
    learned_terp_vector: {},
    feedback_count: 0,
    sessions_count: 0,
    favorites: [],
    feedback_log: [],
  };
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export async function addFavorite(entry: FavoriteEntry): Promise<void> {
  const profile = await getUserProfile();
  if (!profile) return;

  const existing = profile.favorites.findIndex((f) => f.strainKey === entry.strainKey);
  if (existing >= 0) return; // already saved

  const favorites = [entry, ...profile.favorites].slice(0, MAX_FAVORITES);
  await saveUserProfile({ ...profile, favorites });
}

export async function removeFavorite(strainKey: string): Promise<void> {
  const profile = await getUserProfile();
  if (!profile) return;
  const favorites = profile.favorites.filter((f) => f.strainKey !== strainKey);
  await saveUserProfile({ ...profile, favorites });
}

export async function isFavorited(strainKey: string): Promise<boolean> {
  const profile = await getUserProfile();
  return profile?.favorites.some((f) => f.strainKey === strainKey) ?? false;
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

export async function addFeedback(entry: FeedbackEntry): Promise<void> {
  const profile = await getUserProfile();
  if (!profile) return;

  const feedback_log = [entry, ...profile.feedback_log].slice(0, MAX_FEEDBACK_LOG);
  const feedback_count = profile.feedback_count + 1;

  // Update learned vectors from thumbs up/down
  const learned_effect_vector = { ...profile.learned_effect_vector };
  const learned_terp_vector = { ...profile.learned_terp_vector };
  const delta = entry.signal === "thumbs_up" ? 0.15 : -0.15;

  for (const tag of entry.strainEffectTags) {
    learned_effect_vector[tag] = Math.max(-1, Math.min(1, (learned_effect_vector[tag] ?? 0) + delta));
  }
  for (const terp of entry.strainTerpeneTags) {
    learned_terp_vector[terp] = Math.max(-1, Math.min(1, (learned_terp_vector[terp] ?? 0) + delta * 0.6));
  }

  await saveUserProfile({
    ...profile,
    feedback_log,
    feedback_count,
    learned_effect_vector,
    learned_terp_vector,
  });
}

// ─── Age Verification ─────────────────────────────────────────────────────────

export async function isAgeVerified(): Promise<boolean> {
  const result = await chrome.storage.local.get("ageVerified");
  return (result.ageVerified as boolean) ?? false;
}

export async function setAgeVerified(verified: boolean): Promise<void> {
  await chrome.storage.local.set({ ageVerified: verified });
}

// ─── Strain Profile Cache ─────────────────────────────────────────────────────

export async function getCachedStrainProfile(
  name: string,
  category: string
): Promise<CachedStrainProfile | null> {
  const key = cacheKey(name, category);
  const result = await chrome.storage.local.get("cachedStrainProfiles");
  const cache = (result.cachedStrainProfiles ?? {}) as Record<string, CachedStrainProfile>;
  const entry = cache[key];
  if (!entry) return null;

  if (Date.now() - entry.cachedAt > entry.ttl) {
    delete cache[key];
    await chrome.storage.local.set({ cachedStrainProfiles: cache });
    return null;
  }
  return entry;
}

export async function setCachedStrainProfile(
  name: string,
  category: string,
  data: CachedStrainProfile["data"]
): Promise<void> {
  const key = cacheKey(name, category);
  const result = await chrome.storage.local.get("cachedStrainProfiles");
  const cache = (result.cachedStrainProfiles ?? {}) as Record<string, CachedStrainProfile>;
  cache[key] = { data, cachedAt: Date.now(), ttl: CACHE_TTL_MS };
  await chrome.storage.local.set({ cachedStrainProfiles: cache });
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────

export async function checkLocalRateLimit(): Promise<{ allowed: boolean; remaining: number }> {
  const today = todayStr();
  const result = await chrome.storage.local.get(["insightsUsedToday", "insightsResetDate"]);
  const resetDate = result.insightsResetDate as string | undefined;
  let used = (result.insightsUsedToday as number) ?? 0;

  if (resetDate !== today) {
    used = 0;
    await chrome.storage.local.set({ insightsUsedToday: 0, insightsResetDate: today });
  }

  if (used >= DAILY_LIMIT) return { allowed: false, remaining: 0 };
  return { allowed: true, remaining: DAILY_LIMIT - used };
}

export async function incrementInsightCount(): Promise<void> {
  const today = todayStr();
  const result = await chrome.storage.local.get(["insightsUsedToday", "insightsResetDate"]);
  const resetDate = result.insightsResetDate as string | undefined;
  let used = (result.insightsUsedToday as number) ?? 0;
  if (resetDate !== today) used = 0;
  await chrome.storage.local.set({ insightsUsedToday: used + 1, insightsResetDate: today });
}

// ─── Account ──────────────────────────────────────────────────────────────────

export async function getAccountEmail(): Promise<string | null> {
  const result = await chrome.storage.local.get("accountEmail");
  return (result.accountEmail as string) ?? null;
}

export async function clearAll(): Promise<void> {
  await chrome.storage.local.clear();
}

// ─── Legacy getPreferences (kept for backward compat) ─────────────────────────

export async function getPreferences(): Promise<LegacyUserPreferences | null> {
  const result = await chrome.storage.local.get("preferences");
  return (result.preferences as LegacyUserPreferences) ?? null;
}

export async function savePreferences(prefs: LegacyUserPreferences): Promise<void> {
  await chrome.storage.local.set({ preferences: prefs });
}
