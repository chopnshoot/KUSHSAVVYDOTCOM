import { NextRequest, NextResponse } from "next/server";
import { getRedis, keys } from "@/lib/db";
import { computePersonalizedScore } from "@/lib/personalized-scoring";
import { computeConsensusScore } from "@/lib/consensus-scoring";
import type { UserProfile } from "@/extension/src/lib/types";

export async function GET(request: NextRequest) {
  const canonical_product_id = request.nextUrl.searchParams.get("id");
  const device_id = request.nextUrl.searchParams.get("device_id");

  if (!canonical_product_id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const redis = getRedis();
  const canonicalData = await redis.get<Record<string, unknown>>(keys.canonicalProduct(canonical_product_id));

  if (!canonicalData) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Compute consensus score from stored reviews
  let consensus = null;
  const reviewStrings = await redis.lrange(keys.reviewsForProduct(canonical_product_id), 0, 99);
  if (reviewStrings.length > 0) {
    const reviews = reviewStrings.map((r) => {
      const parsed = typeof r === "string" ? JSON.parse(r) : r;
      return {
        rating_value: parsed.rating,
        rating_scale: 5,
        review_text: parsed.text ?? "",
        source_weight: parsed.source_weight ?? 0.5,
        captured_at: new Date(parsed.captured_at ?? Date.now()),
      };
    });
    const result = computeConsensusScore(reviews);
    consensus = {
      score: result.score,
      confidence: result.confidence,
      top_reasons: result.top_reasons,
      sample_size: result.sample_size,
    };
  }

  // Compute personalized score if device_id provided
  let personalized = null;
  if (device_id) {
    const profileKey = `profile:${device_id}`;
    const profileData = await redis.get<{ userProfile: UserProfile }>(profileKey);

    if (profileData?.userProfile) {
      const userProfile = profileData.userProfile;
      const productFeatures = {
        effect_tags: (canonicalData.effect_tags as Array<{ tag: string; support_weight: number }>) ?? [],
        warning_tags: (canonicalData.warning_tags as Array<{ tag: string; support_weight: number }>) ?? [],
        terpene_tags: (canonicalData.terpene_tags as Array<{ name: string; percent_estimate?: number }>) ?? [],
        potency_thc: (canonicalData.potency_thc as number) ?? undefined,
        category: (canonicalData.category as string) ?? "unknown",
      };

      const userVector = {
        effect_vector: userProfile.effect_vector ?? {},
        avoid_vector: userProfile.avoid_vector ?? {},
        terp_preference_vector: userProfile.terp_preference_vector ?? {},
        potency_target: userProfile.potency_target ?? 0.55,
        tolerance_prior: userProfile.tolerance_prior ?? 0.4,
        preferred_categories: userProfile.preferred_categories ?? [],
        learned_effect_vector: userProfile.learned_effect_vector,
        learned_terp_vector: userProfile.learned_terp_vector,
        feedback_count: userProfile.feedback_count ?? 0,
      };

      const result = computePersonalizedScore(userVector, productFeatures);
      personalized = {
        score: result.score,
        confidence: result.confidence,
        score_label: result.score_label,
        why_it_matches: result.why_it_matches,
        watch_out_for: result.watch_out_for,
      };
    }
  }

  return NextResponse.json({
    canonical_product_id,
    canonical_data: canonicalData,
    consensus,
    personalized,
  });
}
