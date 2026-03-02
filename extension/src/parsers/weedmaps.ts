import type { ProductData } from "../lib/types";

// Weedmaps product page parser
// Targets: weedmaps.com/dispensaries/*/menu/* and product detail pages

function normalizeCategory(raw: string): ProductData["category"] {
  const lower = raw.toLowerCase();
  if (lower.includes("flower") || lower.includes("bud")) return "flower";
  if (lower.includes("vape") || lower.includes("cartridge") || lower.includes("cart")) return "vape";
  if (lower.includes("edible") || lower.includes("gummy") || lower.includes("chocolate") || lower.includes("beverage")) return "edible";
  if (lower.includes("concentrate") || lower.includes("wax") || lower.includes("shatter") || lower.includes("rosin") || lower.includes("live resin") || lower.includes("dab")) return "concentrate";
  if (lower.includes("pre-roll") || lower.includes("preroll") || lower.includes("joint") || lower.includes("blunt")) return "preroll";
  if (lower.includes("tincture")) return "tincture";
  if (lower.includes("topical") || lower.includes("cream") || lower.includes("lotion") || lower.includes("patch")) return "topical";
  return "unknown";
}

function normalizeStrainType(raw: string): ProductData["strainType"] | undefined {
  const lower = raw.toLowerCase();
  if (lower.includes("sativa")) return "sativa";
  if (lower.includes("indica")) return "indica";
  if (lower.includes("hybrid") || lower.includes("balanced")) return "hybrid";
  return undefined;
}

function extractPercentage(text: string): string | undefined {
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? `${match[1]}%` : undefined;
}

function tryText(selector: string, root: Document | Element = document): string {
  return root.querySelector(selector)?.textContent?.trim() ?? "";
}

export function parseWeedmaps(): ProductData | null {
  // Weedmaps renders with React, so we read from data attributes and text content.
  // These selectors are based on Weedmaps' current DOM structure (2025/2026).

  // Product name — multiple possible selectors
  const name =
    tryText('[data-testid="product-name"]') ||
    tryText(".product-name") ||
    tryText("h1.product__name") ||
    tryText("h1[class*='ProductName']") ||
    tryText("h1");

  if (!name) return null;

  // Category / type
  const categoryRaw =
    tryText('[data-testid="product-category"]') ||
    tryText(".product-category") ||
    tryText("[class*='category-tag']") ||
    tryText("[class*='CategoryTag']") ||
    document.querySelector("meta[property='product:category']")?.getAttribute("content") ||
    "";

  const category = normalizeCategory(categoryRaw);

  // Strain type
  const strainTypeRaw =
    tryText('[data-testid="strain-type"]') ||
    tryText("[class*='StrainType']") ||
    tryText("[class*='strain-type']") ||
    tryText("[class*='GeneticType']") ||
    "";

  const strainType = normalizeStrainType(strainTypeRaw);

  // THC
  const thcEl =
    document.querySelector('[data-testid="thc-percentage"]') ||
    document.querySelector("[class*='THC'][class*='value']") ||
    document.querySelector("[class*='thc-value']");

  const thcText = thcEl?.textContent?.trim() ?? "";
  const thc = extractPercentage(thcText) || thcText || undefined;

  // CBD
  const cbdEl =
    document.querySelector('[data-testid="cbd-percentage"]') ||
    document.querySelector("[class*='CBD'][class*='value']") ||
    document.querySelector("[class*='cbd-value']");

  const cbdText = cbdEl?.textContent?.trim() ?? "";
  const cbd = extractPercentage(cbdText) || cbdText || undefined;

  // Price
  const price =
    tryText('[data-testid="product-price"]') ||
    tryText(".product-price") ||
    tryText("[class*='Price']") ||
    undefined;

  // Weight
  const weight =
    tryText('[data-testid="product-weight"]') ||
    tryText("[class*='weight']") ||
    tryText("[class*='Weight']") ||
    undefined;

  // Brand
  const brand =
    tryText('[data-testid="brand-name"]') ||
    tryText("[class*='BrandName']") ||
    tryText("[class*='brand-name']") ||
    undefined;

  // Dispensary name
  const dispensary =
    tryText('[data-testid="dispensary-name"]') ||
    tryText("[class*='DispensaryName']") ||
    document.querySelector("meta[property='og:site_name']")?.getAttribute("content") ||
    undefined;

  // Terpenes — often listed as chips/tags
  const terpeneEls = document.querySelectorAll(
    '[data-testid="terpene"], [class*="terpene-tag"], [class*="TerpeneChip"], [class*="terpene-chip"]'
  );
  const terpenes =
    terpeneEls.length > 0
      ? Array.from(terpeneEls)
          .map((el) => el.textContent?.trim() ?? "")
          .filter(Boolean)
      : undefined;

  // Raw description
  const rawDescription =
    tryText('[data-testid="product-description"]') ||
    tryText("[class*='ProductDescription']") ||
    tryText("[class*='product-description']") ||
    undefined;

  // COA link
  const coaLink =
    (document.querySelector(
      'a[href*="coa"], a[href*="lab-result"], a[href*="certificate"]'
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
    source: "weedmaps",
    rawDescription: rawDescription || undefined,
    coaLink,
  };
}
