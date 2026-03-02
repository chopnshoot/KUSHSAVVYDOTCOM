import { NextRequest, NextResponse } from "next/server";

// Affiliate link generator for KushSavvy extension.
// Returns tracked links to Weedmaps and Leafly for strain searches.
// No AI required — pure URL construction with affiliate tracking params.

function buildWeedmapsLink(strain: string, city?: string, state?: string): string {
  const params = new URLSearchParams({ q: strain, ref: "kushsavvy" });
  if (city) params.set("loc", `${city}, ${state ?? ""}`.trim());
  return `https://weedmaps.com/search?${params.toString()}`;
}

function buildLeaflyLink(strain: string, city?: string, state?: string): string {
  const params = new URLSearchParams({ q: strain, partner: "kushsavvy" });
  if (city) params.set("location", `${city}${state ? `, ${state}` : ""}`);
  return `https://www.leafly.com/search?${params.toString()}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const strain = searchParams.get("strain");
  const city = searchParams.get("city") ?? undefined;
  const state = searchParams.get("state") ?? undefined;

  if (!strain) {
    return NextResponse.json(
      { error: "Missing required param: strain" },
      { status: 400 }
    );
  }

  const weedmaps = buildWeedmapsLink(strain, city, state);
  const leafly = buildLeaflyLink(strain, city, state);

  return NextResponse.json({ weedmaps, leafly });
}
