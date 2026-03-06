import { NextRequest, NextResponse } from "next/server";
import { canonicalizeProduct } from "@/lib/canonicalization";
import { computePersonalizedScore } from "@/lib/personalized-scoring";
import { getRedis, keys, TTL, canonicalProductKey, normalizeName } from "@/lib/db";
import type { UserProfile } from "@/extension/src/lib/types";

interface PageCaptureRequest {
  event: {
    event_version: string;
    captured_at_utc: string;
    user: {
      anonymous_device_id: string;
      consent_flags: { capture_enabled: boolean; send_reviews: boolean };
    };
    source: { domain: string; url: string; page_type: string; geo_hint?: { state?: string; city?: string } };
    extracted: {
      product_name: string;
      brand_name?: string;
      category: string;
      subcategory?: string;
      strain_display_name?: string;
      strain_type_claimed?: string;
      price?: { amount: number; currency: string };
      unit_size?: { value: number; unit: string };
      potency: { thc_percent?: number; cbd_percent?: number };
      terpenes: Array<{ name: string; percent?: number }>;
      site_tags: { effects: string[]; flavors: string[] };
      reviews: { count_visible: number; items: Array<{ rating?: number; text: string }> };
    };
    evidence: { description_text?: string; lab_report_url?: string; dom_snapshot_hash: string };
  };
  userProfile?: UserProfile;
}

// Source weights by domain
const SOURCE_WEIGHTS: Record<string, number> = {
  "dutchie.com": 0.80,
  "iheartjane.com": 0.80,
  "leafly.com": 0.60,
  "weedmaps.com": 0.60,
  "allbud.com": 0.50,
};
function getSourceWeight(domain: string): number {
  return SOURCE_WEIGHTS[domain] ?? 0.50;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PageCaptureRequest;
    const { event, userProfile } = body;

    if (!event?.extracted?.product_name || !event?.user?.anonymous_device_id) {
      return NextResponse.json({ error: "Missing required event fields" }, { status: 400 });
    }

    const { extracted, source, evidence } = event;
    const sourceWeight = getSourceWeight(source.domain);

    // Build canonical product key for lookup/storage
    const cpKey = canonicalProductKey(
      extracted.brand_name,
      extracted.strain_display_name ?? extracted.product_name,
      extracted.category
    );

    const redis = getRedis();

    // Check if we already have a canonical product for this key
    let canonicalProductId: string | null = await redis.get<string>(keys.productAlias(cpKey));
    let canonicalData: Record<string, unknown> | null = null;

    if (canonicalProductId) {
      canonicalData = await redis.get<Record<string, unknown>>(keys.canonicalProduct(canonicalProductId));
    }

    // Run canonicalization if no existing match or stale data
    if (!canonicalData) {
      try {
        const resolution = await canonicalizeProduct(
          {
            product_name: extracted.product_name,
            brand_name: extracted.brand_name,
            strain_display_name: extracted.strain_display_name,
            category: extracted.category,
            subcategory: extracted.subcategory,
            strain_type_claimed: extracted.strain_type_claimed,
            potency: extracted.potency,
            terpenes: extracted.terpenes,
            site_tags: extracted.site_tags,
            description_text: evidence.description_text,
            source_domain: source.domain,
            source_weight: sourceWeight,
            lab_report_url: evidence.lab_report_url,
          },
          [],
          []
        );

        // Generate a stable canonical product ID from the resolved name
        const resolvedName = resolution.resolution.canonical_product.canonical_product_name.value;
        const resolvedBrand = resolution.resolution.canonical_product.brand_canonical.value;
        const resolvedCategory = resolution.resolution.canonical_product.category.value;
        const resolvedCpKey = canonicalProductKey(resolvedBrand, resolvedName, resolvedCategory);

        canonicalProductId = resolvedCpKey;

        // Store canonical product
        const canonicalDoc = {
          canonical_product_id: canonicalProductId,
          canonical_product_name: resolvedName,
          brand_canonical: resolvedBrand,
          category: resolvedCategory,
          subcategory: resolution.resolution.canonical_product.subcategory.value,
          canonical_strain_name: resolution.resolution.canonical_product.canonical_strain_name.value,
          canonical_strain_type: resolution.resolution.canonical_product.canonical_strain_type.value,
          effect_tags: resolution.extracted_features.effects.tags,
          warning_tags: resolution.extracted_features.warnings.tags,
          terpene_tags: resolution.extracted_features.terpenes,
          potency_thc: resolution.extracted_features.potency.thc_percent_estimate.value,
          overall_confidence: resolution.overall_confidence,
          created_at: Date.now(),
        };

        await redis.set(keys.canonicalProduct(canonicalProductId), canonicalDoc, { ex: TTL.canonicalProduct });

        // Store aliases for fast lookup
        for (const alias of resolution.resolution.aliases_to_add.product_aliases) {
          const normalizedAlias = normalizeName(alias.alias_text) + ":" + resolvedCategory;
          await redis.set(keys.productAlias(normalizedAlias), canonicalProductId, { ex: TTL.canonicalProduct });
        }
        // Also store the primary key
        await redis.set(keys.productAlias(cpKey), canonicalProductId, { ex: TTL.canonicalProduct });

        canonicalData = canonicalDoc as Record<string, unknown>;
      } catch (err) {
        console.error("Canonicalization failed:", err);
        // Continue without canonical product — still useful for insights
      }
    }

    // Compute personalized score if user profile is available
    let score = null;
    if (userProfile && canonicalData) {
      const productFeatures = {
        effect_tags: (canonicalData.effect_tags as Array<{ tag: string; support_weight: number }>) ?? [],
        warning_tags: (canonicalData.warning_tags as Array<{ tag: string; support_weight: number }>) ?? [],
        terpene_tags: (canonicalData.terpene_tags as Array<{ name: string; percent_estimate?: number }>) ?? [],
        potency_thc: (canonicalData.potency_thc as number) ?? undefined,
        category: extracted.category,
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
        budget_range: userProfile.budget_range,
      };

      const personalizedResult = computePersonalizedScore(
        userVector,
        productFeatures,
        extracted.price?.amount
      );

      score = {
        canonical_product_id: canonicalProductId ?? undefined,
        consensus: null, // TODO: compute from stored reviews
        personalized: {
          score: personalizedResult.score,
          confidence: personalizedResult.confidence,
          score_label: personalizedResult.score_label,
          why_it_matches: personalizedResult.why_it_matches,
          watch_out_for: personalizedResult.watch_out_for,
        },
        data_quality: {
          has_coa: !!evidence.lab_report_url,
          has_terp_table: extracted.terpenes.length > 0,
          review_count: extracted.reviews.count_visible,
          contradictions: 0,
          overall_confidence: (canonicalData?.overall_confidence as number) ?? 0.5,
        },
      };
    }

    // Store reviews for later consensus scoring
    if (extracted.reviews.items.length > 0 && canonicalProductId) {
      const reviewKey = keys.reviewsForProduct(canonicalProductId);
      const reviewData = extracted.reviews.items.map((r) => ({
        ...r,
        source_domain: source.domain,
        source_weight: sourceWeight,
        captured_at: event.captured_at_utc,
      }));
      await redis.lpush(reviewKey, ...reviewData.map((r) => JSON.stringify(r)));
      await redis.expire(reviewKey, TTL.canonicalProduct);
    }

    return NextResponse.json({
      ok: true,
      canonical_product_id: canonicalProductId,
      score,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Page capture error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
