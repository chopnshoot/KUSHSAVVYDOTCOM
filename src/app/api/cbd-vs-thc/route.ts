import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { storeResult } from "@/lib/results";
import { generateCbdVsThcMeta } from "@/lib/result-meta";

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

    const { goal, experience, concerns } = await request.json();

    if (!goal) {
      return NextResponse.json(
        { error: "Goal is required" },
        { status: 400 }
      );
    }

    const prompt = `You are a cannabinoid education specialist. Help a user understand whether CBD, THC, or a combination is best for their needs.

User info:
- Primary goal: ${goal}
- Cannabis experience: ${experience || "Not specified"}
- Concerns: ${Array.isArray(concerns) ? concerns.join(", ") : concerns || "None specified"}

Return ONLY valid JSON with no additional text:
{
  "recommendation": "CBD" | "THC" | "Both (CBD + THC)",
  "confidence": "string (e.g. 'Strong match' or 'Good starting point')",
  "summary": "string (2-3 sentence personalized explanation)",
  "cbd_breakdown": {
    "relevance": "High" | "Medium" | "Low",
    "why": "string (1-2 sentences about CBD for their goal)",
    "suggested_form": "string (e.g. 'Oil tincture, 25-50mg daily')",
    "onset": "string (e.g. '30-60 minutes')"
  },
  "thc_breakdown": {
    "relevance": "High" | "Medium" | "Low",
    "why": "string (1-2 sentences about THC for their goal)",
    "suggested_form": "string (e.g. 'Low-dose edible, 2.5-5mg')",
    "onset": "string (e.g. '30-90 minutes for edibles')"
  },
  "ratio_suggestion": "string (e.g. '1:1 CBD:THC' or 'CBD only' or '20:1 CBD:THC')",
  "start_low_guide": "string (specific starting dose recommendation)",
  "important_note": "string (safety/legal disclaimer)"
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
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

    const parsedInput = { goal, experience, concerns };
    const meta = generateCbdVsThcMeta(parsedInput, result);
    let shareHash: string | null = null;
    try {
      shareHash = await storeResult({
        tool: "cbd-vs-thc",
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
      shareUrl: shareHash ? `/tools/cbd-vs-thc/r/${shareHash}` : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("CBD vs THC error:", message);
    return NextResponse.json(
      { error: `Failed to generate recommendation: ${message}` },
      { status: 500 }
    );
  }
}
