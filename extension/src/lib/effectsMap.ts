// ─── effectsMap.ts ────────────────────────────────────────────────────────────
// Vocabulary bridge: maps user preference enums → AI tag strings
// Also provides flavor → terpene mapping for Q7 of onboarding

import type { DesiredEffect, EffectToAvoid } from "./types";

// ─── Desired Effect → Effect Tags ─────────────────────────────────────────────

export const EFFECT_TO_TAGS: Record<DesiredEffect, string[]> = {
  relaxation:    ["relaxed", "calm", "soothing", "stress_relief", "tension_relief", "chill"],
  creativity:    ["creative", "focused", "uplifted", "cerebral", "introspective", "inspired"],
  energy:        ["energetic", "uplifting", "active", "motivated", "alert", "invigorated"],
  pain_relief:   ["pain_relief", "analgesic", "numbing", "body_high", "physical_relief", "anti_inflammatory"],
  anxiety_relief:["calming", "anxiety_relief", "grounding", "peaceful", "serene", "anti_anxiety"],
  social:        ["social", "euphoric", "talkative", "giggly", "uplifted", "happy", "fun"],
  appetite:      ["appetite", "munchies", "hunger", "stimulates_appetite"],
  intimacy:      ["intimate", "sensual", "relaxed", "euphoric", "body_high"],
};

// ─── Effect to Avoid → Avoidance Tags ─────────────────────────────────────────

export const AVOID_TO_TAGS: Record<EffectToAvoid, string[]> = {
  paranoia:        ["paranoia", "paranoid", "anxiety_inducing", "overwhelming", "anxiety_risk"],
  couch_lock:      ["couch_lock", "sedating", "heavy", "immobilizing", "body_lock"],
  heavy_sedation:  ["heavy_sedation", "soporific", "knock_out", "couch_lock", "sleepy_heavy"],
  racing_thoughts: ["racing_thoughts", "overthinking", "cerebral_overwhelming", "anxiety_inducing"],
  dry_mouth:       ["dry_mouth", "cottonmouth", "extreme_dry_mouth", "dry_mouth_heavy"],
};

// ─── Flavor → Terpene Vector (Q7 mapping) ─────────────────────────────────────

export const FLAVOR_TO_TERPS: Record<string, Record<string, number>> = {
  citrus:   { limonene: 0.8, valencene: 0.2 },
  pine:     { pinene: 0.85, terpinolene: 0.15 },
  berry:    { myrcene: 0.5, ocimene: 0.3, linalool: 0.2 },
  sweet:    { myrcene: 0.4, linalool: 0.4, ocimene: 0.2 },
  gassy:    { caryophyllene: 0.5, humulene: 0.3, myrcene: 0.2 },
  earthy:   { myrcene: 0.6, humulene: 0.3, caryophyllene: 0.1 },
  floral:   { linalool: 0.6, geraniol: 0.3, ocimene: 0.1 },
  spicy:    { caryophyllene: 0.7, humulene: 0.2, myrcene: 0.1 },
  minty:    { pinene: 0.5, eucalyptol: 0.4, terpinolene: 0.1 },
  tropical: { myrcene: 0.3, limonene: 0.3, ocimene: 0.3, valencene: 0.1 },
  diesel:   { caryophyllene: 0.4, myrcene: 0.4, limonene: 0.2 },
  skunky:   { myrcene: 0.6, caryophyllene: 0.3, humulene: 0.1 },
};

// Build terpene preference vector from selected flavor tags
export function buildTerpPreferenceVector(flavors: string[]): Record<string, number> {
  const raw: Record<string, number> = {};

  for (const flavor of flavors) {
    const terps = FLAVOR_TO_TERPS[flavor] ?? {};
    for (const [terp, weight] of Object.entries(terps)) {
      raw[terp] = (raw[terp] ?? 0) + weight;
    }
  }

  // Normalize so values sum to 1
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  if (total === 0) return {};

  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v / total]));
}

// ─── Desired Effects → Normalized Effect Vector (Q2 mapping) ─────────────────

// Maps each desired effect to its canonical vector key
const EFFECT_TO_VECTOR_KEY: Record<DesiredEffect, string> = {
  relaxation:    "calm",
  creativity:    "creative",
  energy:        "energy",
  pain_relief:   "pain_relief",
  anxiety_relief:"calm",     // shared with relaxation but different intent
  social:        "social",
  appetite:      "appetite",
  intimacy:      "intimate",
};

export function buildEffectVector(effects: DesiredEffect[]): Record<string, number> {
  if (effects.length === 0) return {};
  const weight = 1 / effects.length;
  const vec: Record<string, number> = {};
  for (const e of effects) {
    const key = EFFECT_TO_VECTOR_KEY[e];
    vec[key] = (vec[key] ?? 0) + weight;
  }
  return vec;
}

// ─── Effect Avoidance → Penalty Vector (Q3 mapping) ──────────────────────────

const AVOID_TO_VECTOR_KEY: Record<EffectToAvoid, string> = {
  paranoia:        "anxiety_risk",
  couch_lock:      "couch_lock",
  heavy_sedation:  "heavy_sedation",
  racing_thoughts: "anxiety_risk",
  dry_mouth:       "dry_mouth",
};

export function buildAvoidVector(avoids: EffectToAvoid[]): Record<string, number> {
  if (avoids.length === 0) return {};
  const weight = 0.5;  // each avoid tag gets penalty weight 0.5
  const vec: Record<string, number> = {};
  for (const a of avoids) {
    const key = AVOID_TO_VECTOR_KEY[a];
    vec[key] = Math.min(1, (vec[key] ?? 0) + weight);
  }
  return vec;
}

// ─── Potency Target from PotencyPreference ────────────────────────────────────

export const POTENCY_TARGET: Record<string, number> = {
  light:      0.30,
  medium:     0.55,
  strong:     0.75,
  very_strong: 0.90,
};

// ─── Tolerance Prior from ExperienceLevel ─────────────────────────────────────

export const TOLERANCE_PRIOR: Record<string, number> = {
  new:    0.2,
  casual: 0.4,
  weekly: 0.6,
  daily:  0.8,
};
