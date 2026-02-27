import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Redis } from "@upstash/redis";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check if API key is set
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    checks.api_key = "MISSING";
    return NextResponse.json({ status: "error", checks }, { status: 503 });
  }
  checks.api_key = `set (${apiKey.slice(0, 8)}...${apiKey.slice(-4)})`;

  // Test a minimal API call
  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 10,
      messages: [{ role: "user", content: "Say OK" }],
    });
    const text = message.content.find((c) => c.type === "text");
    checks.api_call = `success (response: ${text?.type === "text" ? text.text : "no text"})`;
  } catch (error) {
    checks.api_call = `FAILED: ${error instanceof Error ? error.message : String(error)}`;
  }

  // Check Redis (Upstash) — required for shareable result links
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    checks.redis = "MISSING — shareable links will not work";
  } else {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      await redis.set("health-check", "ok", { ex: 60 });
      const val = await redis.get("health-check");
      checks.redis = val === "ok" ? "connected" : `unexpected value: ${val}`;
    } catch (error) {
      checks.redis = `FAILED: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  const hasFailure = Object.values(checks).some((v) => v.startsWith("FAILED") || v === "MISSING" || v.startsWith("MISSING"));
  return NextResponse.json(
    { status: hasFailure ? "degraded" : "ok", checks },
    { status: hasFailure ? 503 : 200 }
  );
}
