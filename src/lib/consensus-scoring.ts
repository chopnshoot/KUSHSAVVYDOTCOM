// ─── Consensus Scoring ────────────────────────────────────────────────────────
// Weighted review aggregation with source weights and recency decay.

export interface Review {
  rating_value?: number;        // e.g. 4.5
  rating_scale?: number;        // e.g. 5
  review_text: string;
  source_weight: number;        // from sources table (0–1)
  captured_at: Date;
  sentiment_score?: number;     // 0–1 if pre-computed
}

export interface ConsensusScoreResult {
  score: number;          // 0–100
  confidence: number;     // 0–1
  sample_size: number;
  top_reasons: string[];
  score_components: {
    weighted_mean: number;
    agreement_factor: number;
    sample_factor: number;
  };
}

// ─── Recency decay ────────────────────────────────────────────────────────────

function recencyWeight(capturedAt: Date, halfLifeDays = 120): number {
  const ageDays = (Date.now() - capturedAt.getTime()) / (1000 * 60 * 60 * 24);
  return Math.exp(-0.693 * (ageDays / halfLifeDays)); // half-life decay
}

// ─── Simple sentiment from rating ─────────────────────────────────────────────

function ratingToSentiment(rating: number, scale: number): number {
  return rating / scale;  // normalizes to 0–1
}

// ─── Text quality weight ──────────────────────────────────────────────────────

function textQualityWeight(text: string): number {
  const words = text.trim().split(/\s+/).length;
  if (words < 5)  return 0.4;   // too short, low signal
  if (words < 20) return 0.7;
  if (words < 60) return 1.0;
  return 0.9;  // very long reviews have slightly lower weight (wall of text)
}

// ─── Weighted standard deviation ──────────────────────────────────────────────

function weightedStddev(values: number[], weights: number[]): number {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return 0;

  const mean = values.reduce((sum, v, i) => sum + v * weights[i], 0) / totalWeight;
  const variance =
    values.reduce((sum, v, i) => sum + weights[i] * Math.pow(v - mean, 2), 0) / totalWeight;

  return Math.sqrt(variance);
}

// ─── Main consensus score function ────────────────────────────────────────────

export function computeConsensusScore(reviews: Review[]): ConsensusScoreResult {
  if (reviews.length === 0) {
    return {
      score: 0,
      confidence: 0,
      sample_size: 0,
      top_reasons: [],
      score_components: { weighted_mean: 0, agreement_factor: 0, sample_factor: 0 },
    };
  }

  const scores: number[] = [];
  const weights: number[] = [];

  for (const review of reviews) {
    let sentimentScore: number;

    if (review.rating_value != null && review.rating_scale != null) {
      sentimentScore = ratingToSentiment(review.rating_value, review.rating_scale);
    } else if (review.sentiment_score != null) {
      sentimentScore = review.sentiment_score;
    } else {
      // No rating or pre-computed sentiment — skip
      continue;
    }

    const w =
      review.source_weight *
      recencyWeight(review.captured_at) *
      textQualityWeight(review.review_text);

    scores.push(sentimentScore);
    weights.push(w);
  }

  if (scores.length === 0) {
    return {
      score: 0,
      confidence: 0,
      sample_size: reviews.length,
      top_reasons: ["Insufficient review data for scoring"],
      score_components: { weighted_mean: 0, agreement_factor: 0, sample_factor: 0 },
    };
  }

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const weighted_mean = scores.reduce((sum, v, i) => sum + v * weights[i], 0) / totalWeight;
  const consensus_score = Math.round(100 * weighted_mean);

  // Confidence calculation from spec
  const n = scores.length;
  const sample_factor = Math.min(1, Math.log(1 + n) / Math.log(1 + 50));
  const stddev = weightedStddev(scores, weights);
  const agreement_factor = Math.max(0, 1 - stddev);
  const confidence = Math.min(
    0.95,
    Math.max(0.1, 0.2 + 0.5 * sample_factor + 0.25 * agreement_factor)
  );

  // Top reasons
  const top_reasons: string[] = [];
  if (weighted_mean >= 0.8) top_reasons.push("Highly rated across sources");
  else if (weighted_mean >= 0.65) top_reasons.push("Strong positive review sentiment");
  else if (weighted_mean < 0.4) top_reasons.push("Mixed or negative review sentiment");
  if (n >= 20) top_reasons.push(`${n} verified reviews`);
  else if (n >= 5) top_reasons.push(`${n} reviews aggregated`);
  if (agreement_factor > 0.8) top_reasons.push("High reviewer agreement");

  return {
    score: consensus_score,
    confidence,
    sample_size: n,
    top_reasons,
    score_components: { weighted_mean, agreement_factor, sample_factor },
  };
}
