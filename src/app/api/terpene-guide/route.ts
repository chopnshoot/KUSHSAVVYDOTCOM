import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { storeResult } from "@/lib/results";
import { generateTerpeneGuideMeta } from "@/lib/result-meta";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        { error: "Service configuration error. Please contact support." },
        { status: 503 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const { terpene } = await request.json();

    if (!terpene) {
      return NextResponse.json(
        { error: "Terpene name is required" },
        { status: 400 }
      );
    }

    const prompt = `You are a cannabis terpene expert. Provide detailed information about the terpene "${terpene}" in cannabis.

Return ONLY valid JSON with no additional text:
{
  "name": "${terpene}",
  "pronunciation": "string (phonetic pronunciation)",
  "aroma": "string (1-2 word aroma profile)",
  "description": "string (2-3 sentences about this terpene)",
  "effects": ["string", "string", "string"] (3 primary effects),
  "medical_benefits": ["string", "string", "string"] (3 potential therapeutic uses),
  "also_found_in": ["string", "string", "string"] (3 common non-cannabis sources),
  "strains_high_in": ["string", "string", "string"] (3 popular cannabis strains rich in this terpene),
  "boiling_point": "string (in °F and °C)",
  "synergies": "string (1-2 sentences about how it interacts with other terpenes/cannabinoids)",
  "fun_fact": "string (one interesting fact)"
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response received");
    }

    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }

    const result = JSON.parse(jsonMatch[0]);

    const parsedInput = { terpene };
    const meta = generateTerpeneGuideMeta(parsedInput, result);
    let shareHash: string | null = null;
    try {
      shareHash = await storeResult({
        tool: "terpene-guide",
        input: parsedInput,
        output: JSON.stringify(result),
        meta,
      });
    } catch (err) {
      console.error("Failed to store shareable result:", err instanceof Error ? err.message : err);
    }

    return NextResponse.json({
      ...result,
      shareHash,
      shareUrl: shareHash ? `/tools/terpene-guide/r/${shareHash}` : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Terpene guide error:", message);
    return NextResponse.json(
      { error: `Failed to load terpene information: ${message}` },
      { status: 500 }
    );
  }
}
