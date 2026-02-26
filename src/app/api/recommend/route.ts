import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { effects, experience, method, avoid, flavor } = await request.json();

    if (!effects || !experience || !method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `You are KushSavvy's strain recommendation engine. Based on the user's preferences, recommend exactly 3 cannabis strains. Use only well-known, widely available strains.

User preferences:
- Desired effects: ${effects.join(", ")}
- Experience level: ${experience}
- Consumption method: ${method}
- Effects to avoid: ${avoid?.join(", ") || "None specified"}
- Flavor preference: ${flavor?.join(", ") || "No preference"}

Return ONLY valid JSON with no additional text:
{
  "recommendations": [
    {
      "name": "string",
      "type": "Indica | Sativa | Hybrid",
      "ratio": "string (e.g. '70% Indica / 30% Sativa')",
      "thc_range": "string (e.g. '18-22%')",
      "cbd_range": "string (e.g. '<1%')",
      "terpenes": ["string", "string", "string"],
      "effects": ["string", "string", "string"],
      "flavors": ["string", "string"],
      "best_for": "string (one-line use case)",
      "description": "string (2-3 sentence description of the experience)",
      "why_for_you": "string (1 sentence explaining why this matches their preferences)"
    }
  ]
}

Prioritize strains that are commonly found at dispensaries nationwide. Avoid extremely rare or region-specific strains. Ensure variety across your 3 recommendations (don't recommend 3 of the same type).`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
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
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations. Please try again." },
      { status: 500 }
    );
  }
}
