// ─── GPT Canonicalization Service ─────────────────────────────────────────────
// Takes product candidate data + evidence and resolves to canonical identity.
// Uses strict JSON output. Run synchronously on first capture, async thereafter.

import OpenAI from "openai";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductCandidate {
  product_name: string;
  brand_name?: string;
  strain_display_name?: string;
  category: string;
  subcategory?: string;
  strain_type_claimed?: string;
  potency?: { thc_percent?: number; cbd_percent?: number };
  terpenes?: Array<{ name: string; percent?: number }>;
  site_tags?: { effects: string[]; flavors: string[] };
  description_text?: string;
  source_domain: string;
  source_weight: number;
  lab_report_url?: string;
}

export interface CanonicalResolution {
  job_version: "1.0";
  resolution: {
    canonical_product: {
      canonical_product_name: { value: string; confidence: number };
      category: { value: string; confidence: number };
      subcategory: { value: string | null; confidence: number };
      brand_canonical: { value: string | null; confidence: number };
      canonical_strain_name: { value: string | null; confidence: number };
      canonical_strain_type: { value: string; confidence: number };
    };
    entity_links: {
      existing_canonical_product_id: { value: string | null; confidence: number };
      existing_canonical_strain_id: { value: string | null; confidence: number };
    };
    aliases_to_add: {
      product_aliases: Array<{ alias_text: string; source_domain?: string; confidence: number }>;
      strain_aliases: Array<{ alias_text: string; source_domain?: string; confidence: number }>;
    };
  };
  extracted_features: {
    potency: {
      thc_percent_estimate: { value: number | null; confidence: number };
      cbd_percent_estimate: { value: number | null; confidence: number };
    };
    terpenes: Array<{
      name: string;
      percent_estimate: number;
      confidence: number;
      evidence_ids: string[];
    }>;
    effects: {
      tags: Array<{ tag: string; support_weight: number; evidence_ids: string[] }>;
    };
    warnings: {
      tags: Array<{ tag: string; support_weight: number; evidence_ids: string[] }>;
    };
    flavors: {
      tags: Array<{ tag: string; support_weight: number; evidence_ids: string[] }>;
    };
  };
  contradictions: Array<{
    field: string;
    claims: Array<{ value: string; source_domain: string; weight: number }>;
    chosen_value: string;
    confidence: number;
  }>;
  overall_confidence: number;
  recommended_next_actions: Array<{ action: string; reason: string }>;
}

// ─── Prompt builders ──────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are KushSavvy's cannabis product canonicalization engine.

Your job is to resolve a cannabis product listing into a canonical identity, extract structured features from evidence, and flag contradictions. You work like a careful analyst who only writes down what the evidence actually supports.

STRICT RULES:
1. Evidence-based decisions only. Never invent terpene percentages, genetics, or effects without evidence.
2. Express confidence on every material field (0.0–1.0 float).
3. List ALL contradictions you find, even minor ones.
4. Use normalized, lowercase strings for all tags and names (e.g. "myrcene" not "Myrcene").
5. Effect and warning tags must come from this controlled vocabulary:
   Effects: relaxed, calm, creative, focused, uplifted, euphoric, energetic, social, talkative, sleepy, giggly, alert, happy, motivated
   Warnings: anxiety_risk, paranoia_risk, couch_lock, dry_mouth, heavy_sedation, racing_thoughts, dizziness, hunger
6. Canonical strain type must be one of: indica, sativa, hybrid, unknown
7. Canonical category must be one of: flower, vape, edible, concentrate, preroll, tincture, topical, unknown
8. Never make medical claims. Never infer medical benefits.
9. Return ONLY valid JSON. No markdown, no prose outside JSON.
10. If confidence on a field is below 0.4, set the value to null rather than guessing.`;
}

function buildUserPrompt(
  primary: ProductCandidate,
  supporting: ProductCandidate[],
  existingMatches: Array<{ id: string; name: string; similarity: number }>
): string {
  const allCandidates = [primary, ...supporting];

  const evidenceSummary = allCandidates.map((c, i) => {
    const parts = [
      `Source ${i + 1}: ${c.source_domain} (weight: ${c.source_weight})`,
      `  Name: "${c.product_name}"`,
      c.brand_name ? `  Brand: "${c.brand_name}"` : null,
      c.strain_display_name ? `  Strain: "${c.strain_display_name}"` : null,
      `  Category: ${c.category}${c.subcategory ? ` / ${c.subcategory}` : ""}`,
      c.strain_type_claimed ? `  Strain type claimed: ${c.strain_type_claimed}` : null,
      c.potency?.thc_percent != null ? `  THC: ${c.potency.thc_percent}%` : null,
      c.potency?.cbd_percent != null ? `  CBD: ${c.potency.cbd_percent}%` : null,
      c.terpenes?.length
        ? `  Terpenes: ${c.terpenes.map((t) => `${t.name}${t.percent != null ? ` (${t.percent}%)` : ""}`).join(", ")}`
        : null,
      c.site_tags?.effects?.length ? `  Site effects tags: ${c.site_tags.effects.join(", ")}` : null,
      c.site_tags?.flavors?.length ? `  Site flavor tags: ${c.site_tags.flavors.join(", ")}` : null,
      c.lab_report_url ? `  COA link: ${c.lab_report_url}` : null,
      c.description_text ? `  Description: ${c.description_text.slice(0, 400)}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    return parts;
  }).join("\n\n");

  const existingSection = existingMatches.length > 0
    ? `\nPotential existing canonical products in database:\n${existingMatches.map((m) =>
        `  - ID: ${m.id}, Name: "${m.name}", Similarity: ${m.similarity}`
      ).join("\n")}`
    : "";

  return `Canonicalize this cannabis product using the evidence below.

${evidenceSummary}
${existingSection}

Return this exact JSON structure with all fields populated:
{
  "job_version": "1.0",
  "resolution": {
    "canonical_product": {
      "canonical_product_name": { "value": "...", "confidence": 0.0 },
      "category": { "value": "flower|vape|edible|concentrate|preroll|tincture|topical|unknown", "confidence": 0.0 },
      "subcategory": { "value": null, "confidence": 0.0 },
      "brand_canonical": { "value": null, "confidence": 0.0 },
      "canonical_strain_name": { "value": null, "confidence": 0.0 },
      "canonical_strain_type": { "value": "indica|sativa|hybrid|unknown", "confidence": 0.0 }
    },
    "entity_links": {
      "existing_canonical_product_id": { "value": null, "confidence": 0.0 },
      "existing_canonical_strain_id": { "value": null, "confidence": 0.0 }
    },
    "aliases_to_add": {
      "product_aliases": [],
      "strain_aliases": []
    }
  },
  "extracted_features": {
    "potency": {
      "thc_percent_estimate": { "value": null, "confidence": 0.0 },
      "cbd_percent_estimate": { "value": null, "confidence": 0.0 }
    },
    "terpenes": [],
    "effects": { "tags": [] },
    "warnings": { "tags": [] },
    "flavors": { "tags": [] }
  },
  "contradictions": [],
  "overall_confidence": 0.0,
  "recommended_next_actions": []
}

Post-validation checklist (verify before returning):
1. overall_confidence reflects the weakest link in the chain
2. Any field with confidence < 0.4 has value set to null
3. All terpene names are lowercase
4. Effect and warning tags come only from the controlled vocabulary
5. Contradictions list every field with conflicting claims across sources`;
}

// ─── Validate & retry ─────────────────────────────────────────────────────────

function validate(result: CanonicalResolution): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!result.job_version) issues.push("Missing job_version");
  if (!result.resolution?.canonical_product?.canonical_product_name?.value)
    issues.push("Missing canonical_product_name");
  if (typeof result.overall_confidence !== "number")
    issues.push("Missing overall_confidence");
  if (!Array.isArray(result.contradictions)) issues.push("Missing contradictions array");
  if (!result.extracted_features?.effects?.tags) issues.push("Missing effects.tags");

  return { valid: issues.length === 0, issues };
}

// ─── Main canonicalization function ───────────────────────────────────────────

export async function canonicalizeProduct(
  primary: ProductCandidate,
  supporting: ProductCandidate[] = [],
  existingMatches: Array<{ id: string; name: string; similarity: number }> = []
): Promise<CanonicalResolution> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const openai = new OpenAI({ apiKey });
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(primary, supporting, existingMatches);

  let lastError: Error | null = null;

  // Up to 2 attempts
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.1,
    });

    const raw = response.choices[0]?.message?.content ?? "";

    try {
      const parsed = JSON.parse(raw) as CanonicalResolution;
      const { valid, issues } = validate(parsed);

      if (valid || attempt === 1) {
        if (!valid) {
          console.warn("Canonicalization validation issues (using anyway):", issues);
        }
        return parsed;
      }

      lastError = new Error(`Validation failed: ${issues.join(", ")}`);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error("JSON parse failed");
    }
  }

  throw lastError ?? new Error("Canonicalization failed");
}
