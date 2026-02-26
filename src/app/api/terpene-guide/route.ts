import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
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
    return NextResponse.json(result);
  } catch (error) {
    console.error("Terpene guide error:", error);
    return NextResponse.json(
      { error: "Failed to load terpene information. Please try again." },
      { status: 500 }
    );
  }
}
