import type { UserProfile } from "./types";
import { getInstallationId } from "./storage";

const BASE_URL = "https://kushsavvy.com";

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

// ─── Sync profile to server ────────────────────────────────────────────────────

export async function syncProfileToServer(profile: UserProfile): Promise<void> {
  if (!profile.profileBackupEnabled) return;

  const installationId = await getInstallationId();
  const checksum = await computeChecksum({ installationId, profile });

  await fetch(`${BASE_URL}/api/extension/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ installationId, userProfile: profile, checksum }),
  });
}

export function debouncedSync(profile: UserProfile, delayMs = 5000): void {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    syncProfileToServer(profile).catch(console.error);
  }, delayMs);
}

// ─── Restore profile from server ──────────────────────────────────────────────

export async function restoreProfileFromServer(): Promise<UserProfile | null> {
  const installationId = await getInstallationId();

  try {
    const response = await fetch(
      `${BASE_URL}/api/extension/profile?installationId=${installationId}`
    );
    if (!response.ok) return null;

    const data = await response.json() as { found: boolean; userProfile?: UserProfile };
    if (!data.found || !data.userProfile) return null;

    return data.userProfile;
  } catch {
    return null;
  }
}

// ─── Delete profile from server ───────────────────────────────────────────────

export async function deleteServerProfile(): Promise<void> {
  const installationId = await getInstallationId();

  await fetch(`${BASE_URL}/api/extension/profile`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ installationId }),
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function computeChecksum(data: unknown): Promise<string> {
  const text = JSON.stringify(data);
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}
