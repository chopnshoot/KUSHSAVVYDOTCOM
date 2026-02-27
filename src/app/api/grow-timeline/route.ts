import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { storeResult } from "@/lib/results";
import { generateGrowTimelineMeta } from "@/lib/result-meta";

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

    const parsedInput = { strain_type, grow_method, experience, environment };
    const meta = generateGrowTimelineMeta(parsedInput, result);
    let shareHash: string | null = null;
    try {
      shareHash = await storeResult({
        tool: "grow-timeline",
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
      shareUrl: shareHash ? `/tools/grow-timeline/r/${shareHash}` : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Grow timeline error:", message);
    return NextResponse.json(
      { error: `Failed to generate grow timeline: ${message}` },
      { status: 500 }
    );
  }
}
