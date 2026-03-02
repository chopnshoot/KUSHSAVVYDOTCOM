import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkExtensionRateLimit } from "@/lib/extension-rate-limit";

// COA Analysis endpoint — Tier 2 (Claude Sonnet) only.
// Lab report interpretation requires stronger reasoning than strain insights.
// A bad COA interpretation could mislead someone about product safety.

// ─── COA Analysis Prompt ──────────────────────────────────────────────────────

function buildCOAPrompt(params: {
  coaText?: string;
  coaUrl?: string;
  productName: string;
  claimedThc?: string;
}): string {
  const { coaText, coaUrl, productName, claimedThc } = params;

  const input = coaText
    ? `COA content:\n${coaText.slice(0, 4000)}`
    : `COA URL: ${coaUrl}\n(Analyze based on URL pattern and any available metadata)`;

  return `Analyze this cannabis Certificate of Analysis (COA) and return a complete assessment.

Product: ${productName}${claimedThc ? `\nLabel THC claim: ${claimedThc}` : ""}
${input}

Cannabis COA context:
- ISO/IEC 17025 accreditation is the gold standard for testing labs
- METRC batch numbers are required in states with track-and-trace systems
- Pesticide, heavy metal, microbial, solvent, and mycotoxin tests should all be present
- THC discrepancies >3% from label are significant
- Known labs with inflation issues include some smaller regional labs (flag if unrecognized)
- Common red flags: missing batch numbers, unnamed labs, only potency tested (no safety tests), post-dated results

Return this exact JSON (all fields required):
{
  "labName": "Laboratory name",
  "labAccredited": true or false,
  "testDate": "YYYY-MM-DD or 'unknown'",
  "safetyTests": {
    "pesticides": "pass" or "fail" or "not_tested",
    "heavyMetals": "pass" or "fail" or "not_tested",
    "microbial": "pass" or "fail" or "not_tested",
    "solvents": "pass" or "fail" or "not_tested",
    "mycotoxins": "pass" or "fail" or "not_tested"
  },
  "potency": {
    "thc": "percentage",
    "thca": "percentage",
    "cbd": "percentage",
    "totalThc": "calculated total THC percentage",
    "matchesLabel": true or false,
    "discrepancy": "description of any discrepancy, or null"
  },
  "terpeneProfile": [
    {
      "name": "Terpene name",
      "percentage": "percentage",
      "aroma": "aroma descriptor",
      "effect": "effect"
    }
  ] or [],
  "redFlags": ["red flag 1", "red flag 2"] or [],
  "summary": "2-3 sentence plain-English summary of what this COA means for the consumer",
  "grade": "A" or "B" or "C" or "D" or "F"
}

Grade criteria:
A = Accredited lab, all safety tests pass, potency matches label, full terpene profile
B = Accredited lab, most tests pass, minor discrepancies
C = Lab unknown/unaccredited, or missing some safety tests, or notable potency discrepancy
D = Multiple red flags, missing critical tests, significant potency mismatch
F = Failed safety tests, fraud indicators, lab not recognizable`;
}

// ─── Route Handler ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      coaUrl,
      coaText,
      productName,
      claimedThc,
      installationId,
    }: {
      coaUrl?: string;
      coaText?: string;
      productName: string;
      claimedThc?: string;
      installationId: string;
    } = body;

    if (!installationId || !productName) {
      return NextResponse.json(
        { error: "Missing required fields: installationId and productName" },
        { status: 400 }
      );
    }

    if (!coaUrl && !coaText) {
      return NextResponse.json(
        { error: "Must provide either coaUrl or coaText" },
        { status: 400 }
      );
    }

    // Rate limit — COA uses Tier 2, 5/day limit
    const rateLimit = await checkExtensionRateLimit(installationId, "coa");
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: "Daily COA analysis limit reached (5/day). Create a free account for higher limits.", remaining: 0 },
        { status: 429 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    // If we have a COA URL but no text, attempt to fetch the URL content
    let resolvedCoaText = coaText;
    if (coaUrl && !coaText) {
      try {
        const fetchResponse = await fetch(coaUrl, {
          headers: { "User-Agent": "KushSavvy/2.0 (kushsavvy.com)" },
          signal: AbortSignal.timeout(8000),
        });
        if (fetchResponse.ok) {
          const contentType = fetchResponse.headers.get("content-type") ?? "";
          if (contentType.includes("text") || contentType.includes("html")) {
            const text = await fetchResponse.text();
            // Extract text content (basic HTML stripping)
            resolvedCoaText = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 4000);
          }
          // PDF handling: we can't parse PDFs in Edge runtime,
          // but we include the URL in the prompt for Claude to analyze patterns
        }
      } catch {
        // URL fetch failed — proceed with just the URL for pattern analysis
      }
    }

    const anthropic = new Anthropic({ apiKey });

    const prompt = buildCOAPrompt({
      coaText: resolvedCoaText,
      coaUrl,
      productName,
      claimedThc,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((c) => c.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No response from AI");
    }

    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI returned invalid JSON");
    }

    const coaAnalysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json(coaAnalysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("COA analysis error:", message);
    return NextResponse.json(
      { error: `Failed to analyze COA: ${message}` },
      { status: 500 }
    );
  }
}
