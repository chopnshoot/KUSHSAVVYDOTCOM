import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { strain1, strain2 } = await request.json();

    if (!strain1 || !strain2) {
      return NextResponse.json(
        { error: "Two strains are required for comparison" },
        { status: 400 }
      );
    }

    const prompt = `You are a cannabis strain comparison expert. Compare these two strains in detail.

Strain 1: ${typeof strain1 === "string" ? strain1 : JSON.stringify(strain1)}
Strain 2: ${typeof strain2 === "string" ? strain2 : JSON.stringify(strain2)}

Return ONLY valid JSON with no additional text:
{
  "strain1": {
    "name": "string",
    "type": "Indica | Sativa | Hybrid",
    "thc_range": "string (e.g. '18-22%')",
    "cbd_range": "string (e.g. '<1%')",
    "top_effects": ["string", "string", "string"],
    "top_flavors": ["string", "string", "string"],
    "best_for": "string (one-line use case)",
    "terpenes": ["string", "string"]
  },
  "strain2": {
    "name": "string",
    "type": "Indica | Sativa | Hybrid",
    "thc_range": "string (e.g. '20-25%')",
    "cbd_range": "string (e.g. '<1%')",
    "top_effects": ["string", "string", "string"],
    "top_flavors": ["string", "string", "string"],
    "best_for": "string (one-line use case)",
    "terpenes": ["string", "string"]
  },
  "summary": "string (2-3 paragraph comparison covering key differences, who each is best for, and a clear verdict for common use cases)"
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
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
    return NextResponse.json(result);
  } catch (error) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      { error: "Failed to generate comparison. Please try again." },
      { status: 500 }
    );
  }
}
