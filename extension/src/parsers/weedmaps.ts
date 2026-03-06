import type { ProductData } from "../lib/types";

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

function extractPercentageNum(text: string): number | undefined {
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? parseFloat(match[1]) : undefined;
}

function extractPriceNum(text: string): number | undefined {
  const match = text.match(/\$?\s*(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : undefined;
}

function tryText(selector: string, root: Document | Element = document): string {
  return root.querySelector(selector)?.textContent?.trim() ?? "";
}

function captureReviews(): ProductData["reviews"] {
  const reviewEls = document.querySelectorAll(
    '[data-testid="review-item"], [class*="ReviewItem"], [class*="review-item"]'
  );
  const reviews: ProductData["reviews"] = [];
  const now = new Date().toISOString();

  reviewEls.forEach((el) => {
    const text = el.querySelector('[class*="review-text"], [class*="ReviewText"], p')?.textContent?.trim();
    const ratingEl = el.querySelector('[class*="rating"], [aria-label*="stars"], [class*="Rating"]');
    const ratingText = ratingEl?.getAttribute("aria-label") ?? ratingEl?.textContent ?? "";
    const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
    if (text && text.length > 10) {
      reviews.push({
        text: text.slice(0, 300),
        rating: ratingMatch ? parseFloat(ratingMatch[1]) : undefined,
        capturedAt: now,
      });
    }
  });

  return reviews.slice(0, 5);
}

function captureSiteTags(): { effects: string[]; flavors: string[] } {
  const effectEls = document.querySelectorAll(
    '[data-testid="effect-tag"], [class*="EffectTag"], [class*="effect-tag"]'
  );
  const flavorEls = document.querySelectorAll(
    '[data-testid="flavor-tag"], [class*="FlavorTag"], [class*="flavor-tag"], [class*="tasting-note"]'
  );

  return {
    effects: Array.from(effectEls).map((el) => el.textContent?.trim().toLowerCase() ?? "").filter(Boolean),
    flavors: Array.from(flavorEls).map((el) => el.textContent?.trim().toLowerCase() ?? "").filter(Boolean),
  };
}

export function parseWeedmaps(): ProductData | null {
  const name =
    tryText('[data-testid="product-name"]') ||
    tryText(".product-name") ||
    tryText("h1.product__name") ||
    tryText("h1[class*='ProductName']") ||
    tryText("h1");

  if (!name) return null;

  const categoryRaw =
    tryText('[data-testid="product-category"]') ||
    tryText(".product-category") ||
    tryText("[class*='category-tag']") ||
    document.querySelector("meta[property='product:category']")?.getAttribute("content") || "";

  const strainTypeRaw =
    tryText('[data-testid="strain-type"]') ||
    tryText("[class*='StrainType']") ||
    tryText("[class*='strain-type']") || "";

  const thcEl =
    document.querySelector('[data-testid="thc-percentage"]') ||
    document.querySelector("[class*='THC'][class*='value']") ||
    document.querySelector("[class*='thc-value']");
  const thcText = thcEl?.textContent?.trim() ?? "";
  const thc = extractPercentage(thcText) || thcText || undefined;
  const thcPercent = extractPercentageNum(thcText);

  const cbdEl =
    document.querySelector('[data-testid="cbd-percentage"]') ||
    document.querySelector("[class*='CBD'][class*='value']") ||
    document.querySelector("[class*='cbd-value']");
  const cbdText = cbdEl?.textContent?.trim() ?? "";
  const cbd = extractPercentage(cbdText) || cbdText || undefined;
  const cbdPercent = extractPercentageNum(cbdText);

  const priceText =
    tryText('[data-testid="product-price"]') ||
    tryText(".product-price") ||
    tryText("[class*='Price']") || "";
  const priceAmount = extractPriceNum(priceText);

  const weight =
    tryText('[data-testid="product-weight"]') ||
    tryText("[class*='weight']") || undefined;

  const brand =
    tryText('[data-testid="brand-name"]') ||
    tryText("[class*='BrandName']") || undefined;

  const dispensary =
    tryText('[data-testid="dispensary-name"]') ||
    document.querySelector("meta[property='og:site_name']")?.getAttribute("content") || undefined;

  const terpeneEls = document.querySelectorAll(
    '[data-testid="terpene"], [class*="terpene-tag"], [class*="TerpeneChip"]'
  );
  const terpenes = terpeneEls.length > 0
    ? Array.from(terpeneEls).map((el) => el.textContent?.trim() ?? "").filter(Boolean)
    : undefined;

  const terpenesParsed = terpenes?.map((t) => {
    const parts = t.split(/\s+/);
    const percentMatch = t.match(/(\d+(?:\.\d+)?)%/);
    return { name: parts[0], percent: percentMatch ? parseFloat(percentMatch[1]) : undefined };
  });

  const rawDescription =
    tryText('[data-testid="product-description"]') ||
    tryText("[class*='ProductDescription']") || undefined;

  const coaLink =
    (document.querySelector('a[href*="coa"], a[href*="lab-result"], a[href*="certificate"]') as HTMLAnchorElement | null)?.href ?? undefined;

  const imageUrls = Array.from(document.querySelectorAll('[class*="ProductImage"] img, [class*="product-image"] img'))
    .map((el) => (el as HTMLImageElement).src)
    .filter((src) => src && !src.includes("placeholder"))
    .slice(0, 3);

  return {
    name,
    brand: brand || undefined,
    category: normalizeCategory(categoryRaw),
    strainType: normalizeStrainType(strainTypeRaw),
    thc: thc || undefined,
    thcPercent,
    cbd: cbd || undefined,
    cbdPercent,
    terpenes,
    terpenesParsed,
    weight: weight || undefined,
    price: priceText || undefined,
    priceAmount,
    dispensary: dispensary || undefined,
    productUrl: window.location.href,
    source: "weedmaps",
    rawDescription: rawDescription || undefined,
    coaLink,
    siteTags: captureSiteTags(),
    reviews: captureReviews(),
    reviewCount: parseInt(tryText('[class*="review-count"]').replace(/\D/g, "") || "0", 10) || undefined,
    imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
  };
}
