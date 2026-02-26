import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Layer 1: Cloudflare Turnstile verification
    const turnstileValid = await verifyTurnstile(body.turnstileToken);
    if (!turnstileValid) {
      return NextResponse.json(
        { error: "Verification failed. Please refresh and try again." },
        { status: 403 }
      );
    }

    // Layer 2: Rate limiting
    const rateLimit = await checkRateLimit(request);
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        {
          error: "rate_limited",
          message: "Daily limit reached",
          remaining: 0,
          limit: rateLimit.limit,
        },
        { status: 429 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        { error: "Service configuration error. Please contact support." },
        { status: 503 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const { strain1, strain2 } = body;

    if (!strain1 || !strain2) {
      return NextResponse.json(
        { error: "Two strains are required for comparison" },
        { status: 400 }
      );
    }

    const prompt = `Compare these two cannabis strains in detail. Return structured JSON.

Strain 1: ${typeof strain1 === "string" ? strain1 : JSON.stringify(strain1)}
Strain 2: ${typeof strain2 === "string" ? strain2 : JSON.stringify(strain2)}

Return ONLY valid JSON with no additional text:
{
  "strain1": {
    "name": "string",
    "type": "Indica | Sativa | Hybrid",
    "ratio": "string (e.g. '70% Indica / 30% Sativa')",
    "thc_range": "string (e.g. '18-22%')",
    "cbd_range": "string (e.g. '<1%')",
    "terpenes": ["string", "string", "string"],
    "effects": ["string", "string", "string", "string"],
    "negativeEffects": ["string", "string"],
    "flavors": ["string", "string", "string"],
    "bestFor": "string"
  },
  "strain2": {
    "name": "string",
    "type": "Indica | Sativa | Hybrid",
    "ratio": "string",
    "thc_range": "string",
    "cbd_range": "string",
    "terpenes": ["string", "string", "string"],
    "effects": ["string", "string", "string", "string"],
    "negativeEffects": ["string", "string"],
    "flavors": ["string", "string", "string"],
    "bestFor": "string"
  },
  "comparison": "string (2-3 paragraph comparison explaining who each strain is best for, key differences, and clear recommendations by use case)",
  "verdict": "string (one sentence: which to pick if you had to choose one)"
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

    // Include rate limit info in the response
    const responseData = {
      ...result,
      _rateLimit: rateLimit
        ? { remaining: rateLimit.remaining, limit: rateLimit.limit }
        : undefined,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Comparison error:", message);
    return NextResponse.json(
      { error: `Failed to generate comparison: ${message}` },
      { status: 500 }
    );
  }
}
