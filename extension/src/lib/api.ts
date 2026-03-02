import type { ProductData, UserPreferences, InsightResponse, COAResponse } from "./types";
import { getInstallationId, getPreferences, incrementInsightCount } from "./storage";

const BASE_URL = "https://kushsavvy.com";

// ─── Insights ─────────────────────────────────────────────────────────────────

export async function fetchInsight(product: ProductData): Promise<InsightResponse> {
  const [installationId, preferences] = await Promise.all([
    getInstallationId(),
    getPreferences(),
  ]);

  const response = await fetch(`${BASE_URL}/api/extension/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product,
      preferences: preferences ?? undefined,
      installationId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? `API error: ${response.status}`
    );
  }

  const data = (await response.json()) as InsightResponse;
  await incrementInsightCount();
  return data;
}

// ─── Quick Strain Lookup (text only) ──────────────────────────────────────────

export async function fetchStrainLookup(strainText: string): Promise<InsightResponse> {
  const product: ProductData = {
    name: strainText,
    category: "unknown",
    productUrl: "",
    source: "generic",
  };
  return fetchInsight(product);
}

// ─── COA Analysis ─────────────────────────────────────────────────────────────

export async function fetchCOAAnalysis(params: {
  coaUrl?: string;
  coaText?: string;
  productName: string;
  claimedThc?: string;
}): Promise<COAResponse> {
  const installationId = await getInstallationId();

  const response = await fetch(`${BASE_URL}/api/extension/coa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, installationId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? `API error: ${response.status}`
    );
  }

  return response.json() as Promise<COAResponse>;
}

// ─── Affiliate Links ──────────────────────────────────────────────────────────

export async function fetchAffiliateLinks(
  strain: string,
  city?: string,
  state?: string
): Promise<{ weedmaps: string; leafly: string }> {
  const params = new URLSearchParams({ strain });
  if (city) params.set("city", city);
  if (state) params.set("state", state);

  const response = await fetch(
    `${BASE_URL}/api/extension/affiliates?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch affiliate links: ${response.status}`);
  }

  return response.json() as Promise<{ weedmaps: string; leafly: string }>;
}
