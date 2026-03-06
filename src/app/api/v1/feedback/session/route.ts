import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/db";
import { getServerProfile, setServerProfile } from "@/lib/profile-store";
import type { UserProfile } from "@/extension/src/lib/types";

interface FeedbackSessionRequest {
  installationId: string;
  canonical_product_id?: string;
  context?: { goal?: string; time_of_day?: string };
  user_rating?: number;          // 1–5
  outcomes?: Record<string, number>;  // { focus: 0.8, anxiety: 0.1 }
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as FeedbackSessionRequest;
    const { installationId, canonical_product_id, user_rating, outcomes } = body;

    if (!installationId) {
      return NextResponse.json({ error: "Missing installationId" }, { status: 400 });
    }

    const redis = getRedis();

    // Store session feedback
    const sessionKey = `feedback:${installationId}:${Date.now()}`;
    await redis.set(sessionKey, {
      installationId,
      canonical_product_id,
      user_rating,
      outcomes,
      context: body.context,
      notes: body.notes,
      created_at: new Date().toISOString(),
    }, { ex: 90 * 24 * 3600 });

    // Update server-stored profile with new session count
    const serverProfile = await getServerProfile(installationId);
    if (serverProfile?.userProfile) {
      const updated: UserProfile = {
        ...serverProfile.userProfile,
        sessions_count: (serverProfile.userProfile.sessions_count ?? 0) + 1,
        updatedAt: Date.now(),
      };

      // Update learned vectors from outcomes if provided
      if (outcomes && user_rating != null && user_rating >= 4) {
        // Positive outcome: strengthen associations
        for (const [outcome, strength] of Object.entries(outcomes)) {
          if (strength > 0.5) {
            updated.learned_effect_vector[outcome] =
              Math.min(1, (updated.learned_effect_vector[outcome] ?? 0) + 0.1 * strength);
          }
        }
      }

      await setServerProfile(installationId, {
        userProfile: updated,
        lastSynced: Date.now(),
        checksum: "",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
