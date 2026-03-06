// ─── Personalized Scoring Service (Puff or Pass) ──────────────────────────────
// Computes a personalized match score for a user–product pair.
// V1: uses stated preferences only (no learned feedback yet).
// V1.5: adds learned_effect_vector and learned_terp_vector.

import type { ScoreLabel } from "@/extension/src/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductFeatures {
  effect_tags: Array<{ tag: string; support_weight: number }>;
  warning_tags: Array<{ tag: string; support_weight: number }>;
  terpene_tags: Array<{ name: string; percent_estimate?: number }>;
  potency_thc?: number;   // 0–100 THC %
  category: string;
}

export interface UserVector {
  effect_vector: Record<string, number>;         // desired effects, normalized
  avoid_vector: Record<string, number>;           // effects to avoid, 0–1 penalty
  terp_preference_vector: Record<string, number>; // terpene preferences
  potency_target: number;                         // 0–1 (light=0.30, strong=0.90)
  tolerance_prior: number;                        // 0–1
  preferred_categories: string[];
  learned_effect_vector?: Record<string, number>; // V1.5
  learned_terp_vector?: Record<string, number>;   // V1.5
  feedback_count?: number;
  budget_range?: { min: number; max: number };
}

export interface PersonalizedScoreResult {
  score: number;             // 0–100 integer
  confidence: number;        // 0–1
  score_label: ScoreLabel;
  why_it_matches: string[];  // up to 3 reasons
  watch_out_for: string[];   // up to 2 warnings
  components: {
    match_effects: number;    // 0–1
    terp_fit: number;         // 0–1
    potency_fit: number;      // 0–1
    price_fit: number;        // 0–1
    penalty_warnings: number; // 0–1 (to subtract)
  };
}

// ─── Cosine Similarity ────────────────────────────────────────────────────────

function cosineSim(
  a: Record<string, number>,
  b: Record<string, number>
): number {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0, magA = 0, magB = 0;

  for (const k of keys) {
    const av = a[k] ?? 0;
    const bv = b[k] ?? 0;
    dot += av * bv;
    magA += av * av;
    magB += bv * bv;
  }

  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// ─── Normalize THC % to 0–1 potency index ─────────────────────────────────────

function thcToPotencyIndex(thcPercent: number, category: string): number {
  // Different categories have different THC scale normalization
  const maxByCategory: Record<string, number> = {
    flower:      35,
    vape:        95,
    concentrate: 95,
    edible:      100,  // mg-based, treat differently — just use 50mg as 1.0
    preroll:     35,
    tincture:    50,
    topical:     10,
    unknown:     35,
  };
  const max = maxByCategory[category] ?? 35;
  return Math.min(1, thcPercent / max);
}

// ─── Build product effect vector from effect tags ─────────────────────────────

function buildProductEffectVector(
  tags: Array<{ tag: string; support_weight: number }>
): Record<string, number> {
  // Normalize effect tag names to match user vector keys
  const EFFECT_TAG_MAP: Record<string, string> = {
    relaxed:   "calm",
    calm:      "calm",
    creative:  "creative",
    focused:   "creative",
    uplifted:  "social",
    euphoric:  "social",
    energetic: "energy",
    social:    "social",
    talkative: "social",
    sleepy:    "pain_relief",  // maps roughly to body/medical
    happy:     "social",
    alert:     "energy",
    motivated: "energy",
    giggly:    "social",
    intimate:  "intimate",
    appetite:  "appetite",
  };

  const vec: Record<string, number> = {};
  for (const { tag, support_weight } of tags) {
    const key = EFFECT_TAG_MAP[tag] ?? tag;
    vec[key] = (vec[key] ?? 0) + support_weight;
  }

  // Normalize
  const total = Object.values(vec).reduce((a, b) => a + b, 0);
  if (total === 0) return {};
  return Object.fromEntries(Object.entries(vec).map(([k, v]) => [k, v / total]));
}

// ─── Build product terpene vector ─────────────────────────────────────────────

function buildProductTerpVector(
  terpenes: Array<{ name: string; percent_estimate?: number }>
): Record<string, number> {
  if (terpenes.length === 0) return {};

  const vec: Record<string, number> = {};
  for (const { name, percent_estimate } of terpenes) {
    vec[name.toLowerCase()] = percent_estimate ?? 1;
  }

  const total = Object.values(vec).reduce((a, b) => a + b, 0);
  if (total === 0) return {};
  return Object.fromEntries(Object.entries(vec).map(([k, v]) => [k, v / total]));
}

// ─── Score label from score ────────────────────────────────────────────────────

function getScoreLabel(score: number): ScoreLabel {
  if (score >= 90) return "Perfect match";
  if (score >= 75) return "Great match";
  if (score >= 60) return "Good fit";
  if (score >= 45) return "Decent option";
  if (score >= 30) return "Use caution";
  return "Probably skip";
}

// ─── Main scoring function ────────────────────────────────────────────────────

export function computePersonalizedScore(
  user: UserVector,
  product: ProductFeatures,
  priceAmount?: number
): PersonalizedScoreResult {
  const productEffectVec = buildProductEffectVector(product.effect_tags);
  const productTerpVec = buildProductTerpVector(product.terpene_tags);
  const productWarningVec = Object.fromEntries(
    product.warning_tags.map(({ tag, support_weight }) => [tag, support_weight])
  );

  // ─── Component 1: Effect match (cosine similarity) ─────────────────────────
  // V1: use stated effect_vector only
  // V1.5: blend with learned_effect_vector weighted by feedback_count
  let effectVec = { ...user.effect_vector };
  const feedbackCount = user.feedback_count ?? 0;
  const learningWeight = Math.min(1, feedbackCount / 20);

  if (feedbackCount > 0 && user.learned_effect_vector) {
    for (const [k, v] of Object.entries(user.learned_effect_vector)) {
      const learnedContrib = v * learningWeight * 0.3;  // blend at most 30% from learned
      effectVec[k] = (effectVec[k] ?? 0) + learnedContrib;
    }
  }

  const match_effects = cosineSim(effectVec, productEffectVec);

  // ─── Component 2: Terpene fit ──────────────────────────────────────────────
  let terpVec = { ...user.terp_preference_vector };
  if (feedbackCount > 0 && user.learned_terp_vector) {
    for (const [k, v] of Object.entries(user.learned_terp_vector)) {
      const learnedContrib = v * learningWeight * 0.3;
      terpVec[k] = (terpVec[k] ?? 0) + learnedContrib;
    }
  }

  const terp_fit = Object.keys(terpVec).length > 0 && Object.keys(productTerpVec).length > 0
    ? cosineSim(terpVec, productTerpVec)
    : 0.5;  // neutral when no terpene data

  // ─── Component 3: Potency fit ──────────────────────────────────────────────
  let potency_fit = 0.5;  // neutral default
  if (product.potency_thc != null) {
    const productPotencyIndex = thcToPotencyIndex(product.potency_thc, product.category);
    potency_fit = 1 - Math.abs(user.potency_target - productPotencyIndex);
    potency_fit = Math.max(0, potency_fit);
  }

  // ─── Component 4: Price fit ────────────────────────────────────────────────
  let price_fit = 1.0;  // assume ok if no budget
  if (user.budget_range && priceAmount != null) {
    if (priceAmount <= user.budget_range.max) {
      price_fit = 1.0;
    } else {
      const overage = (priceAmount - user.budget_range.max) / user.budget_range.max;
      price_fit = Math.max(0, 1 - overage);
    }
  }

  // ─── Warning penalty ───────────────────────────────────────────────────────
  // dot product of user's avoid_vector with product's warning_vector
  let penalty_warnings = 0;
  for (const [key, avoidWeight] of Object.entries(user.avoid_vector)) {
    const productRisk = productWarningVec[key] ?? 0;
    penalty_warnings += avoidWeight * productRisk;
  }
  penalty_warnings = Math.min(1, penalty_warnings);

  // ─── Combine ───────────────────────────────────────────────────────────────
  const personalized_raw =
    0.35 * match_effects +
    0.20 * terp_fit +
    0.20 * potency_fit +
    0.10 * price_fit -
    0.35 * penalty_warnings;

  const score = Math.max(0, Math.min(100, Math.round(100 * personalized_raw)));

  // ─── Confidence ────────────────────────────────────────────────────────────
  const hasTerps = product.terpene_tags.length > 0;
  const hasPotency = product.potency_thc != null;
  const baseConfidence = 0.40;  // from stated preferences alone
  const terpBonus = hasTerps ? 0.20 : 0;
  const potencyBonus = hasPotency ? 0.15 : 0;
  const feedbackBonus = Math.min(0.25, feedbackCount / 20 * 0.25);
  const confidence = Math.min(0.95, baseConfidence + terpBonus + potencyBonus + feedbackBonus);

  // ─── Reasons ───────────────────────────────────────────────────────────────
  const why_it_matches: string[] = [];
  const watch_out_for: string[] = [];

  if (match_effects > 0.5) {
    const topEffect = Object.entries(effectVec).sort(([, a], [, b]) => b - a)[0]?.[0];
    if (topEffect) why_it_matches.push(`Matches your ${topEffect} preference`);
  }

  if (terp_fit > 0.5 && hasTerps) {
    const topTerp = product.terpene_tags[0]?.name;
    if (topTerp) why_it_matches.push(`Contains ${topTerp} — aligns with your flavor profile`);
  }

  if (potency_fit > 0.7 && hasPotency) {
    why_it_matches.push("Potency in your preferred range");
  }

  for (const [key, avoidWeight] of Object.entries(user.avoid_vector)) {
    const productRisk = productWarningVec[key] ?? 0;
    if (productRisk > 0.3 && avoidWeight > 0.3) {
      const label = key.replace(/_/g, " ");
      watch_out_for.push(`Some users report ${label}`);
    }
  }

  if (potency_fit < 0.3 && hasPotency && product.potency_thc != null) {
    const productPotencyIndex = thcToPotencyIndex(product.potency_thc, product.category);
    const dir = productPotencyIndex > user.potency_target ? "stronger" : "lighter";
    watch_out_for.push(`Potency is ${dir} than your usual`);
  }

  return {
    score,
    confidence,
    score_label: getScoreLabel(score),
    why_it_matches: why_it_matches.slice(0, 3),
    watch_out_for: watch_out_for.slice(0, 2),
    components: {
      match_effects,
      terp_fit,
      potency_fit,
      price_fit,
      penalty_warnings,
    },
  };
}
