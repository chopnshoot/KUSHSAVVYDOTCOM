import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import {
  checkExtensionRateLimit,
  getCachedInsight,
  setCachedInsight,
} from "@/lib/extension-rate-limit";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductData {
  name: string;
  brand?: string;
  category: string;
  strainType?: string;
  thc?: string;
  cbd?: string;
  terpenes?: string[];
  weight?: string;
  price?: string;
  dispensary?: string;
  productUrl?: string;
  source?: string;
  rawDescription?: string;
}

// ─── Prompts ──────────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are KushSavvy's AI cannabis intelligence engine. Provide accurate, responsible cannabis product analysis for adult consumers in legal markets.

Grounded in: strain genetics, terpene pharmacology, entourage effect, product category differences, responsible consumption guidance, lab testing knowledge.

IMPORTANT RULES:
- Never make medical claims or diagnose conditions
- Always recommend starting low for beginners
- Flag suspicious potency numbers (Blue Dream at 28%+ is suspicious; typical 18-24%)
- Be accurate about terpene effects — no marketing copy
- Dosing guidance must be product-type appropriate (edibles need wait time warnings)
- Use normalized, lowercase tag strings (e.g. "myrcene" not "Myrcene")
- Effect and warning tags from controlled vocabulary only:
  Effects: relaxed, calm, creative, focused, uplifted, euphoric, energetic, social, talkative, sleepy, giggly, alert, happy, motivated
  Warnings: anxiety_risk, paranoia_risk, couch_lock, dry_mouth, heavy_sedation, racing_thoughts
- Return ONLY valid JSON — no markdown, no prose outside JSON`;
}

function buildInsightPrompt(product: ProductData): string {
  const terpeneList = product.terpenes?.length ? product.terpenes.join(", ") : "not listed";

  return `Analyze this cannabis product and return a comprehensive StrainProfile:

Product: ${product.name}
Category: ${product.category}${product.strainType ? `\nStrain type: ${product.strainType}` : ""}${product.thc ? `\nTHC: ${product.thc}` : ""}${product.cbd ? `\nCBD: ${product.cbd}` : ""}${product.brand ? `\nBrand: ${product.brand}` : ""}
Terpenes listed: ${terpeneList}${product.rawDescription ? `\nProduct description: ${product.rawDescription.slice(0, 500)}` : ""}

Return this exact JSON structure (all fields required):
{
  "effectTags": ["relaxed", "creative"],
  "terpeneTags": ["myrcene", "limonene", "pinene"],
  "avoidanceTags": ["couch_lock"],
  "useCaseTags": ["daytime", "creative", "social"],
  "potencyLevel": "mild|moderate|strong|very_strong",
  "effects": {
    "summary": "2-3 sentence plain-English description of what this strain/product does",
    "primary": ["effect1", "effect2", "effect3"],
    "bestFor": ["use case 1", "use case 2"],
    "caution": ["caution if any — empty array if none"]
  },
  "terpenes": {
    "dominant": [
      {
        "name": "Terpene Name",
        "aroma": "aroma descriptor",
        "effect": "What this terpene specifically does — practical, not academic",
        "percentage": "X.XX%" or null
      }
    ],
    "explanation": "1-2 sentences on how these terpenes interact for this specific experience"
  },
  "dosing": {
    "level": "strong|moderate|mild",
    "beginner": "Specific beginner guidance for THIS product type and potency",
    "regular": "Guidance for regular users",
    "experienced": "Guidance for experienced/high-tolerance users"
  },
  "similar": [
    { "name": "Similar Strain Name", "comparison": "How it compares — more/less of what" }
  ],
  "trustSignal": {
    "status": "verified|caution|warning",
    "message": "Plain English assessment of the potency claim",
    "details": "Additional detail if needed, or null"
  }
}

Rules:
- effectTags: use only controlled vocabulary from system prompt
- avoidanceTags: side effects this strain commonly causes (from warning vocabulary)
- useCaseTags: when/how this is typically used (daytime, nighttime, creative, social, sleep, medical, focus, etc.)
- potencyLevel: mild=<15% THC flower equivalent, moderate=15-22%, strong=22-28%, very_strong=>28%
- Provide exactly 3-4 terpenes in dominant array (infer from genetics if not listed)
- Provide exactly 3 similar strains
- Trust signal: flag THC >30% as "warning", unusually high for strain as "caution", normal as "verified"`;
}

// ─── LLM Routing ─────────────────────────────────────────────────────────────

async function callTier1(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1800,
    temperature: 0.2,
  });
  return response.choices[0]?.message?.content ?? "";
}

async function callTier2(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const anthropic = new Anthropic({ apiKey });
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1800,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });
  const textBlock = response.content.find((c) => c.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "";
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product, installationId }: { product: ProductData; installationId: string } = body;

    if (!product?.name || !installationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Rate limit
    const rateLimit = await checkExtensionRateLimit(installationId, "insight");
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: "Daily insight limit reached (50/day). Resets at midnight.", remaining: 0 },
        { status: 429 }
      );
    }

    // Server-side cache check (same StrainProfile for all users — no personalization on server)
    const cacheKey_name = product.name;
    const cacheKey_cat = product.category || "unknown";
    const cachedData = await getCachedInsight(cacheKey_name, cacheKey_cat);
    if (cachedData) {
      return NextResponse.json({ ...cachedData, cached: true });
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildInsightPrompt(product);

    let rawResponse = "";
    let usedTier2 = false;

    try {
      rawResponse = await callTier1(systemPrompt, userPrompt);
    } catch (tier1Error) {
      console.error("Tier 1 failed, falling back to Tier 2:", tier1Error);
      rawResponse = await callTier2(systemPrompt, userPrompt);
      usedTier2 = true;
    }

    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned invalid JSON");

    const strainProfile = JSON.parse(jsonMatch[0]);

    // Affiliate links for similar strains
    if (strainProfile.similar && Array.isArray(strainProfile.similar)) {
      strainProfile.similar = strainProfile.similar.map(
        (s: { name: string; comparison: string }) => ({
          ...s,
          affiliateLink: `https://weedmaps.com/search?q=${encodeURIComponent(s.name)}&ref=kushsavvy`,
        })
      );
    }

    const responseData = {
      ...strainProfile,
      cached: false,
      _tier: usedTier2 ? 2 : 1,
    };

    // Cache the StrainProfile (no personalization in it — safe to share across users)
    setCachedInsight(cacheKey_name, cacheKey_cat, responseData).catch(console.error);

    return NextResponse.json(responseData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Extension insights error:", message);
    return NextResponse.json({ error: `Failed to generate insights: ${message}` }, { status: 500 });
  }
}
