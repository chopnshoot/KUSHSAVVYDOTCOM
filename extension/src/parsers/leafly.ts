import type { ProductData } from "../lib/types";

// Leafly product/strain page parser
// Targets: leafly.com/dispensary-info/*/menu/* and leafly.com/products/*

function normalizeCategory(raw: string): ProductData["category"] {
  const lower = raw.toLowerCase();
  if (lower.includes("flower")) return "flower";
  if (lower.includes("vape") || lower.includes("cartridge") || lower.includes("pen")) return "vape";
  if (lower.includes("edible") || lower.includes("gummy") || lower.includes("chocolate") || lower.includes("drink")) return "edible";
  if (lower.includes("concentrate") || lower.includes("wax") || lower.includes("shatter") || lower.includes("live") || lower.includes("rosin")) return "concentrate";
  if (lower.includes("pre-roll") || lower.includes("preroll") || lower.includes("joint")) return "preroll";
  if (lower.includes("tincture")) return "tincture";
  if (lower.includes("topical") || lower.includes("lotion") || lower.includes("balm")) return "topical";
  return "unknown";
}

function normalizeStrainType(raw: string): ProductData["strainType"] | undefined {
  const lower = raw.toLowerCase();
  if (lower.includes("sativa")) return "sativa";
  if (lower.includes("indica")) return "indica";
  if (lower.includes("hybrid")) return "hybrid";
  return undefined;
}

function tryText(selector: string, root: Document | Element = document): string {
  return root.querySelector(selector)?.textContent?.trim() ?? "";
}

function extractPercentage(text: string): string | undefined {
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? `${match[1]}%` : undefined;
}

// Try to get JSON-LD structured data first (most reliable)
function parseFromJsonLD(): Partial<ProductData> | null {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent ?? "{}");
      const item = Array.isArray(data) ? data[0] : data;
      if (item["@type"] === "Product" || item.name) {
        return {
          name: item.name,
          brand: item.brand?.name,
          rawDescription: item.description,
        };
      }
    } catch {
      // Continue
    }
  }
  return null;
}

export function parseLeafly(): ProductData | null {
  // Try structured data first
  const jsonLD = parseFromJsonLD();

  // Product name
  const name =
    jsonLD?.name ||
    tryText('[data-testid="product-name"]') ||
    tryText("h1.product-title") ||
    tryText("h1[class*='ProductTitle']") ||
    tryText("h1.pdp-product-title") ||
    tryText("h1");

  if (!name) return null;

  // Category breadcrumb is often the most reliable on Leafly
  const breadcrumbs = document.querySelectorAll(
    'nav[aria-label="breadcrumb"] a, [class*="breadcrumb"] a, [class*="Breadcrumb"] a'
  );
  const breadcrumbTexts = Array.from(breadcrumbs).map((el) => el.textContent?.trim() ?? "");
  const categoryFromBreadcrumb = breadcrumbTexts.find(
    (t) => t && !t.toLowerCase().includes("home") && !t.toLowerCase().includes("menu")
  );

  const categoryRaw =
    categoryFromBreadcrumb ||
    tryText('[data-testid="product-category"]') ||
    tryText("[class*='category']") ||
    tryText("[class*='Category']") ||
    "";

  const category = normalizeCategory(categoryRaw);

  // Strain type
  const strainTypeRaw =
    tryText('[data-testid="strain-type"]') ||
    tryText("[class*='StrainType']") ||
    tryText("[class*='strain-type']") ||
    tryText(".strain-badge") ||
    "";
  const strainType = normalizeStrainType(strainTypeRaw);

  // THC — Leafly typically shows "THC X%" in a dedicated element
  const thcEl = document.querySelector(
    '[data-testid="thc-content"], [class*="thc-content"], [class*="THCContent"]'
  );
  const thcText = thcEl?.textContent?.trim() ?? "";
  const thc = extractPercentage(thcText) || thcText || undefined;

  // CBD
  const cbdEl = document.querySelector(
    '[data-testid="cbd-content"], [class*="cbd-content"], [class*="CBDContent"]'
  );
  const cbdText = cbdEl?.textContent?.trim() ?? "";
  const cbd = extractPercentage(cbdText) || cbdText || undefined;

  // Price
  const price =
    tryText('[data-testid="price"]') ||
    tryText("[class*='price']") ||
    tryText("[class*='Price']") ||
    undefined;

  // Weight
  const weight =
    tryText('[data-testid="weight"]') ||
    tryText("[class*='weight']") ||
    tryText("[class*='Weight']") ||
    undefined;

  // Brand
  const brand =
    jsonLD?.brand ||
    tryText('[data-testid="brand-name"]') ||
    tryText("[class*='BrandName']") ||
    tryText("[class*='brand-name']") ||
    undefined;

  // Dispensary
  const dispensary =
    tryText('[data-testid="dispensary-name"]') ||
    tryText("[class*='DispensaryName']") ||
    document.querySelector("meta[property='og:site_name']")?.getAttribute("content") ||
    undefined;

  // Terpenes
  const terpeneEls = document.querySelectorAll(
    '[data-testid="terpene-tag"], [class*="terpene"], [class*="Terpene"]'
  );
  const terpenes =
    terpeneEls.length > 0
      ? Array.from(terpeneEls)
          .map((el) => el.textContent?.trim() ?? "")
          .filter(Boolean)
          .filter((t) => t.length < 30) // filter out non-terpene content
      : undefined;

  // Description
  const rawDescription =
    jsonLD?.rawDescription ||
    tryText('[data-testid="product-description"]') ||
    tryText("[class*='ProductDescription']") ||
    tryText("[class*='description']") ||
    undefined;

  // COA link
  const coaLink =
    (document.querySelector(
      'a[href*="coa"], a[href*="lab-result"], a[href*="certificate-of-analysis"]'
    ) as HTMLAnchorElement | null)?.href ?? undefined;

  return {
    name,
    brand: brand || undefined,
    category,
    strainType,
    thc: thc || undefined,
    cbd: cbd || undefined,
    terpenes,
    weight: weight || undefined,
    price: price || undefined,
    dispensary: dispensary || undefined,
    productUrl: window.location.href,
    source: "leafly",
    rawDescription: rawDescription || undefined,
    coaLink,
  };
}
