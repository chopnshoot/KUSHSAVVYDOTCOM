import type { ProductData } from "../lib/types";

function normalizeCategory(raw: string): ProductData["category"] {
  const lower = raw.toLowerCase();
  if (lower.includes("flower") || lower.includes("bud")) return "flower";
  if (lower.includes("vape") || lower.includes("cartridge") || lower.includes("cart")) return "vape";
  if (lower.includes("edible") || lower.includes("gummy") || lower.includes("chocolate")) return "edible";
  if (lower.includes("concentrate") || lower.includes("wax") || lower.includes("shatter") || lower.includes("rosin")) return "concentrate";
  if (lower.includes("pre-roll") || lower.includes("preroll") || lower.includes("joint")) return "preroll";
  if (lower.includes("tincture")) return "tincture";
  if (lower.includes("topical")) return "topical";
  return "unknown";
}

function extractPercentageNum(text: string): number | undefined {
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? parseFloat(match[1]) : undefined;
}

function tryText(selector: string, root: Document | Element = document): string {
  return root.querySelector(selector)?.textContent?.trim() ?? "";
}

function parseJsonLd(): Partial<ProductData> {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent ?? "");
      const product = data["@type"] === "Product" ? data : data["@graph"]?.find((g: { "@type": string }) => g["@type"] === "Product");
      if (product) {
        return {
          name: product.name,
          brand: product.brand?.name,
          rawDescription: product.description?.slice(0, 500),
        };
      }
    } catch { /* skip */ }
  }
  return {};
}

function captureSiteTags(): { effects: string[]; flavors: string[] } {
  const effectEls = document.querySelectorAll(
    '[class*="strain-feelings"] li, [class*="StrainFeelings"] li, [data-test="strain-feelings"] li'
  );
  const flavorEls = document.querySelectorAll(
    '[class*="strain-flavors"] li, [class*="StrainFlavors"] li, [data-test="strain-flavors"] li'
  );

  return {
    effects: Array.from(effectEls).map((el) => el.textContent?.trim().toLowerCase() ?? "").filter(Boolean),
    flavors: Array.from(flavorEls).map((el) => el.textContent?.trim().toLowerCase() ?? "").filter(Boolean),
  };
}

function captureReviews(): ProductData["reviews"] {
  const reviewEls = document.querySelectorAll('[data-test="review-card"], [class*="review-card"]');
  const reviews: ProductData["reviews"] = [];
  const now = new Date().toISOString();

  reviewEls.forEach((el) => {
    const text = el.querySelector('[class*="review-body"], p')?.textContent?.trim();
    const ratingInput = el.querySelector('input[type="hidden"][name="rating"]') as HTMLInputElement | null;
    const ratingStars = el.querySelectorAll('[class*="star--filled"], [class*="StarFilled"]').length;
    if (text && text.length > 10) {
      reviews.push({
        text: text.slice(0, 300),
        rating: ratingInput ? parseFloat(ratingInput.value) : ratingStars || undefined,
        capturedAt: now,
      });
    }
  });

  return reviews.slice(0, 5);
}

export function parseLeafly(): ProductData | null {
  // Try JSON-LD first (most reliable)
  const jsonLdData = parseJsonLd();

  const name =
    jsonLdData.name ||
    tryText('[data-test="strain-name"]') ||
    tryText("h1[class*='strain']") ||
    tryText("h1");

  if (!name) return null;

  const categoryRaw =
    tryText('[data-test="product-category"]') ||
    tryText("[class*='category']") ||
    document.querySelector("meta[property='product:category']")?.getAttribute("content") || "";

  const strainTypeEl = document.querySelector('[data-test="strain-type"], [class*="strain-type-tag"]');
  const strainTypeRaw = strainTypeEl?.textContent?.trim() ?? "";
  let strainType: ProductData["strainType"] | undefined;
  if (strainTypeRaw.toLowerCase().includes("sativa")) strainType = "sativa";
  else if (strainTypeRaw.toLowerCase().includes("indica")) strainType = "indica";
  else if (strainTypeRaw.toLowerCase().includes("hybrid")) strainType = "hybrid";

  const thcText =
    tryText('[data-test="thc-percentage"]') ||
    tryText("[class*='thc']") ||
    document.querySelector('[class*="THC"]')?.nextElementSibling?.textContent?.trim() || "";
  const thcPercent = extractPercentageNum(thcText);

  const cbdText =
    tryText('[data-test="cbd-percentage"]') ||
    tryText("[class*='cbd']") || "";
  const cbdPercent = extractPercentageNum(cbdText);

  const terpeneEls = document.querySelectorAll(
    '[data-test="terpene-name"], [class*="terpene-name"], [class*="TerpeneName"]'
  );
  const terpenes = terpeneEls.length > 0
    ? Array.from(terpeneEls).map((el) => el.textContent?.trim() ?? "").filter(Boolean)
    : undefined;

  const priceText = tryText('[data-test="price"], [class*="price"]');
  const priceMatch = priceText.match(/\$?\s*(\d+(?:\.\d+)?)/);
  const priceAmount = priceMatch ? parseFloat(priceMatch[1]) : undefined;

  const dispensary =
    tryText('[data-test="dispensary-name"]') ||
    document.querySelector("meta[property='og:site_name']")?.getAttribute("content") || undefined;

  const coaLink =
    (document.querySelector('a[href*="coa"], a[href*="lab-result"]') as HTMLAnchorElement | null)?.href ?? undefined;

  const imageUrls = Array.from(document.querySelectorAll('img[class*="product-image"], img[class*="strain-image"]'))
    .map((el) => (el as HTMLImageElement).src)
    .filter((src) => src && !src.includes("placeholder"))
    .slice(0, 3);

  const reviewCountText = tryText('[data-test="review-count"]');
  const reviewCountMatch = reviewCountText.match(/(\d+)/);

  return {
    name,
    brand: jsonLdData.brand || tryText('[data-test="brand"]') || undefined,
    category: normalizeCategory(categoryRaw),
    strainType,
    thc: thcPercent ? `${thcPercent}%` : undefined,
    thcPercent,
    cbd: cbdPercent ? `${cbdPercent}%` : undefined,
    cbdPercent,
    terpenes,
    terpenesParsed: terpenes?.map((t) => ({ name: t })),
    price: priceText || undefined,
    priceAmount,
    dispensary: dispensary || undefined,
    productUrl: window.location.href,
    source: "leafly",
    rawDescription: jsonLdData.rawDescription ||
      tryText('[data-test="strain-description"]') || undefined,
    coaLink,
    siteTags: captureSiteTags(),
    reviews: captureReviews(),
    reviewCount: reviewCountMatch ? parseInt(reviewCountMatch[1], 10) : undefined,
    imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
  };
}
