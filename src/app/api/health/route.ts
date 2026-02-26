import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

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
    return NextResponse.json({ status: "error", checks }, { status: 500 });
  }

  return NextResponse.json({ status: "ok", checks });
}
