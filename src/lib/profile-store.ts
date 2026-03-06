import { getRedis, TTL } from "./db";
import type { UserProfile } from "@/extension/src/lib/types";

export interface ServerProfile {
  userProfile: UserProfile;
  lastSynced: number;
  checksum: string;
}

const key = (installationId: string) => `profile:${installationId}`;

export async function getServerProfile(installationId: string): Promise<ServerProfile | null> {
  const redis = getRedis();
  return redis.get<ServerProfile>(key(installationId));
}

export async function setServerProfile(
  installationId: string,
  profile: ServerProfile
): Promise<void> {
  const redis = getRedis();
  await redis.set(key(installationId), profile, { ex: TTL.userProfile });
}

export async function deleteServerProfile(installationId: string): Promise<void> {
  const redis = getRedis();
  await redis.del(key(installationId));
}
