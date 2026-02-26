import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { strain_type, grow_method, experience, environment } =
      await request.json();

    if (!strain_type || !grow_method || !environment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `You are a cannabis cultivation expert. Create a grow timeline plan.

Grower info:
- Strain type: ${strain_type}
- Grow method: ${grow_method}
- Experience: ${experience || "Beginner"}
- Environment: ${environment}

Return ONLY valid JSON with no additional text:
{
  "title": "string (e.g. 'Indoor Indica Grow Timeline')",
  "total_weeks": "string (e.g. '12-16 weeks')",
  "summary": "string (2-3 sentence overview)",
  "phases": [
    {
      "name": "string (phase name, e.g. 'Germination')",
      "duration": "string (e.g. 'Week 1-2')",
      "description": "string (what happens in this phase)",
      "key_tasks": ["string", "string", "string"] (3 main tasks),
      "watch_for": "string (common issues to look out for)"
    }
  ] (5-7 phases from seed/clone to harvest),
  "supplies_needed": ["string", "string", "string", "string", "string"] (5 essential supplies),
  "pro_tips": ["string", "string", "string"] (3 tips for this specific setup),
  "estimated_yield": "string (rough yield estimate for this setup)"
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
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
    console.error("Grow timeline error:", error);
    return NextResponse.json(
      { error: "Failed to generate grow timeline. Please try again." },
      { status: 500 }
    );
  }
}
