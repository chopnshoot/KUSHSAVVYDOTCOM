import type {
  ProductData,
  StrainProfile,
  COAResponse,
  PageCaptureEvent,
  PuffOrPassScore,
  UserProfile,
} from "./types";
import { getInstallationId, getUserProfile, incrementInsightCount } from "./storage";

const BASE_URL = "https://kushsavvy.com";

// ─── DOM snapshot hash (SHA-256 of url + name + thc, no full DOM) ─────────────

async function domSnapshotHash(url: string, name: string, thc?: string): Promise<string> {
  const text = `${url}:${name}:${thc ?? ""}`;
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return "sha256:" + Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

// ─── Page Capture Event (main ingestion path) ─────────────────────────────────

export async function sendPageCapture(product: ProductData): Promise<{
  canonical_product_id?: string;
  score?: PuffOrPassScore;
}> {
  const [installationId, userProfile] = await Promise.all([
    getInstallationId(),
    getUserProfile(),
  ]);

  if (!userProfile?.profileBackupEnabled && userProfile) {
    // User opted out of capture — skip silently
    return {};
  }

  const hash = await domSnapshotHash(product.productUrl, product.name, product.thc);
  const domain = new URL(product.productUrl).hostname.replace(/^www\./, "");
  const now = new Date().toISOString();

  const event: PageCaptureEvent = {
    event_type: "page_capture",
    event_version: "1.0",
    captured_at_utc: now,
    user: {
      anonymous_device_id: installationId,
      consent_flags: {
        capture_enabled: userProfile?.profileBackupEnabled ?? true,
        send_reviews: true,
      },
    },
    source: {
      domain,
      url: product.productUrl,
      page_type: "product",
      geo_hint: product.geoHint,
    },
    extracted: {
      product_name: product.name,
      brand_name: product.brand,
      category: product.category,
      subcategory: product.subcategory,
      strain_display_name: product.name,
      strain_type_claimed: product.strainType,
      price: product.priceAmount
        ? { amount: product.priceAmount, currency: "USD" }
        : undefined,
      potency: {
        thc_percent: product.thcPercent,
        cbd_percent: product.cbdPercent,
      },
      terpenes: product.terpenesParsed ?? (product.terpenes ?? []).map((t) => ({ name: t })),
      site_tags: product.siteTags ?? { effects: [], flavors: [] },
      reviews: {
        count_visible: product.reviewCount ?? product.reviews?.length ?? 0,
        items: (product.reviews ?? []).slice(0, 5).map((r) => ({
          rating: r.rating,
          text: r.text.slice(0, 300),
          captured_at_utc: r.capturedAt,
        })),
      },
    },
    evidence: {
      description_text: product.rawDescription?.slice(0, 2000),
      lab_report_url: product.coaLink,
      dom_snapshot_hash: hash,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}/api/v1/events/page-capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, userProfile }),
    });

    if (!response.ok) return {};

    const data = await response.json() as {
      canonical_product_id?: string;
      score?: PuffOrPassScore;
    };
    return data;
  } catch {
    // Non-blocking — capture failures should not block UI
    return {};
  }
}

// ─── Strain Insights (AI explanation, /api/extension/insights) ────────────────

export async function fetchInsight(product: ProductData): Promise<StrainProfile> {
  const [installationId, userProfile] = await Promise.all([
    getInstallationId(),
    getUserProfile(),
  ]);

  const response = await fetch(`${BASE_URL}/api/extension/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product,
      userProfile: userProfile ?? undefined,
      installationId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? `API error: ${response.status}`
    );
  }

  const data = (await response.json()) as StrainProfile;
  await incrementInsightCount();
  return data;
}

// ─── Quick Strain Lookup ───────────────────────────────────────────────────────

export async function fetchStrainLookup(strainText: string): Promise<StrainProfile> {
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
