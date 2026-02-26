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

    const prompt = `Compare these two cannabis strains for a user trying to decide between them. Be concise, practical, and conversational. 2-3 paragraphs max.

Strain 1: ${JSON.stringify(strain1)}
Strain 2: ${JSON.stringify(strain2)}

Cover: Who each strain is best for, the key differences in experience, and a clear recommendation for common use cases (relaxation, creativity, pain, sleep, social).`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
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

    return NextResponse.json({ summary: textContent.text });
  } catch (error) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      { error: "Failed to generate comparison. Please try again." },
      { status: 500 }
    );
  }
}
