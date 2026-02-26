import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { usage, frequency, duration, goal } = await request.json();

    if (!usage || !frequency || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `You are a cannabis tolerance break advisor. Create a personalized tolerance break plan.

User info:
- Current usage: ${usage}
- Frequency: ${frequency}
- Desired break duration: ${duration}
- Goal: ${goal || "Reset tolerance"}

Return ONLY valid JSON with no additional text:
{
  "plan_title": "string (e.g. '14-Day Tolerance Reset')",
  "summary": "string (2-3 sentence overview of what to expect)",
  "daily_plan": [
    {
      "day": "string (e.g. 'Day 1-2')",
      "title": "string (phase name)",
      "what_to_expect": "string (1-2 sentences about symptoms/feelings)",
      "tips": ["string", "string"] (2 actionable tips for this phase)
    }
  ] (4-6 phases covering the full break),
  "supplements": ["string", "string", "string"] (3 helpful supplements or activities),
  "when_to_resume": "string (guidance on restarting after the break)",
  "expected_benefit": "string (what tolerance improvement to expect)"
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
    console.error("Tolerance plan error:", error);
    return NextResponse.json(
      { error: "Failed to generate plan. Please try again." },
      { status: 500 }
    );
  }
}
