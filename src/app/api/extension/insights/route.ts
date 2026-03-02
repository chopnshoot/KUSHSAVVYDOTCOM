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

interface UserPreferences {
  experienceLevel: string;
  desiredEffects: string[];
  thcSensitivity: string;
  productTypes: string[];
}

// ─── Prompts ──────────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are KushSavvy's AI cannabis intelligence engine. You provide accurate, helpful, and responsible cannabis product analysis for adult consumers in legal markets.

Your analysis is grounded in:
- Known strain genetics and phenotypic characteristics
- Terpene pharmacology and the entourage effect
- Product category differences (flower vs edible vs concentrate dosing is very different)
- Responsible consumption guidance
- Lab testing industry knowledge (potency inflation is a real problem — ~70% of products misrepresent potency per JAMA)

IMPORTANT RULES:
- Never make medical claims or diagnose conditions
- Always recommend starting low for beginners
- Flag genuinely suspicious potency numbers (Blue Dream at 28%+ is suspicious; typical is 18-24%)
- Be accurate about terpene effects — don't repeat marketing copy
- Dosing guidance must be product-type appropriate (edibles need wait time warnings)
- Return ONLY valid JSON — no markdown, no prose outside JSON`;
}

function buildInsightPrompt(product: ProductData, preferences?: UserPreferences): string {
  const terpeneList = product.terpenes?.length
    ? product.terpenes.join(", ")
    : "not listed";

  const prefContext = preferences
    ? `
User profile:
- Experience: ${preferences.experienceLevel}
- Desired effects: ${preferences.desiredEffects.join(", ")}
- THC preference: ${preferences.thcSensitivity}
- Product types used: ${preferences.productTypes.join(", ")}`
    : "";

  return `Analyze this cannabis product and return comprehensive insights:

Product: ${product.name}
Category: ${product.category}${product.strainType ? `\nStrain type: ${product.strainType}` : ""}${product.thc ? `\nTHC: ${product.thc}` : ""}${product.cbd ? `\nCBD: ${product.cbd}` : ""}${product.brand ? `\nBrand: ${product.brand}` : ""}
Terpenes listed: ${terpeneList}${product.rawDescription ? `\nProduct description: ${product.rawDescription.slice(0, 500)}` : ""}${prefContext}

Return this exact JSON structure (all fields required):
{
  "effects": {
    "summary": "2-3 sentence plain-English description of what this strain/product does",
    "primary": ["effect1", "effect2", "effect3"],
    "bestFor": ["use case 1", "use case 2", "use case 3"],
    "caution": ["caution 1 if any — empty array if none"]
  },
  "terpenes": {
    "dominant": [
      {
        "name": "Terpene Name",
        "aroma": "aroma descriptor",
        "effect": "What this terpene specifically does in cannabis — practical, not academic",
        "percentage": "X.XX%" or null
      }
    ],
    "explanation": "1-2 sentences on how these terpenes interact with each other for this specific experience"
  },
  "dosing": {
    "level": "strong" or "moderate" or "mild",
    "beginner": "Specific beginner guidance for THIS product type and potency",
    "regular": "Guidance for regular users",
    "experienced": "Guidance for experienced/high-tolerance users"
  },
  "matchScore": ${preferences ? `{
    "score": 0-100 integer,
    "reasons": ["reason this matches their preferences"],
    "mismatches": ["reason this might not match — empty array if good match"]
  }` : "null"},
  "similar": [
    {
      "name": "Similar Strain Name",
      "comparison": "How it compares — more/less of what"
    }
  ],
  "trustSignal": {
    "status": "verified" or "caution" or "warning",
    "message": "Plain English assessment of the potency claim",
    "details": "Additional detail if needed, or null"
  }
}

Provide exactly 3-4 terpenes in the dominant array (infer from known genetics if not listed on label).
Provide exactly 3 similar strains.
The trust signal should flag THC >30% as "warning", THC that's unusually high for the strain as "caution", and normal ranges as "verified".`;
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
    max_tokens: 1500,
    temperature: 0.3, // Low temp for consistent, factual output
  });

  return response.choices[0]?.message?.content ?? "";
}

async function callTier2(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((c) => c.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "";
}

// ─── AI Page Parser (Tier 2 fallback for unknown sites) ──────────────────────

async function parsePageWithAI(pageText: string, productUrl: string): Promise<Partial<ProductData>> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Extract cannabis product information from this dispensary page text. Return only valid JSON.

Page URL: ${productUrl}
Page text: ${pageText.slice(0, 2000)}

Return JSON:
{
  "name": "product name or null",
  "category": "flower|vape|edible|concentrate|preroll|tincture|topical|unknown",
  "strainType": "sativa|indica|hybrid or null",
  "thc": "percentage like 22% or null",
  "cbd": "percentage or null",
  "brand": "brand name or null",
  "terpenes": ["terpene names if listed"] or []
}`,
      },
    ],
  });

  const text = response.content.find((c) => c.type === "text");
  if (!text || text.type !== "text") return {};

  const match = text.text.match(/\{[\s\S]*\}/);
  if (!match) return {};

  return JSON.parse(match[0]) as Partial<ProductData>;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      product,
      preferences,
      installationId,
      pageText,
    }: {
      product: ProductData;
      preferences?: UserPreferences;
      installationId: string;
      pageText?: string;
    } = body;

    // Validate required fields
    if (!product?.name || !installationId) {
      return NextResponse.json(
        { error: "Missing required fields: product.name and installationId" },
        { status: 400 }
      );
    }

    // Rate limit by installationId
    const rateLimit = await checkExtensionRateLimit(installationId, "insight");
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: "Daily insight limit reached (50/day). Resets at midnight.", remaining: 0 },
        { status: 429 }
      );
    }

    // Server-side cache check (product data without personalization)
    // Match scores are stripped from cache since they're user-specific
    const cacheKey_name = product.name;
    const cacheKey_cat = product.category || "unknown";

    // Only cache non-personalized insights
    const cachedData = await getCachedInsight(cacheKey_name, cacheKey_cat);
    if (cachedData && !preferences) {
      return NextResponse.json({ ...cachedData, cached: true });
    }

    // AI page parser fallback: if product name is present but category is "unknown"
    // and we have page text, use Tier 2 to extract structured data
    let enrichedProduct = { ...product };
    if (product.category === "unknown" && pageText && product.source === "generic") {
      try {
        const extracted = await parsePageWithAI(pageText, product.productUrl ?? "");
        enrichedProduct = {
          ...enrichedProduct,
          ...Object.fromEntries(
            Object.entries(extracted).filter(([, v]) => v != null)
          ),
        };
      } catch (err) {
        console.error("AI page parser failed:", err);
        // Continue with what we have
      }
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildInsightPrompt(enrichedProduct, preferences);

    // Tier 1: GPT-4o Mini (90% of calls — fast, cheap, great for structured data)
    let rawResponse = "";
    let usedTier2 = false;

    try {
      rawResponse = await callTier1(systemPrompt, userPrompt);
    } catch (tier1Error) {
      console.error("Tier 1 failed, falling back to Tier 2:", tier1Error);
      rawResponse = await callTier2(systemPrompt, userPrompt);
      usedTier2 = true;
    }

    // Parse response
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI returned invalid JSON");
    }

    const insight = JSON.parse(jsonMatch[0]);

    // Affiliate links for similar strains
    if (insight.similar && Array.isArray(insight.similar)) {
      insight.similar = insight.similar.map(
        (s: { name: string; comparison: string }) => ({
          ...s,
          affiliateLink: `https://weedmaps.com/search?q=${encodeURIComponent(s.name)}&ref=kushsavvy`,
        })
      );
    }

    const responseData = {
      ...insight,
      cached: false,
      _tier: usedTier2 ? 2 : 1,
    };

    // Cache the non-personalized version for future requests
    if (!preferences) {
      setCachedInsight(cacheKey_name, cacheKey_cat, responseData).catch(console.error);
    }

    return NextResponse.json(responseData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Extension insights error:", message);
    return NextResponse.json(
      { error: `Failed to generate insights: ${message}` },
      { status: 500 }
    );
  }
}
