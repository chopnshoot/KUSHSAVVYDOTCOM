import type { ProductData } from "../lib/types";

// Generic fallback parser — works on any page with cannabis product info.
// Uses heuristics and schema.org markup. For completely unstructured pages,
// the API endpoint uses Claude as the final fallback (AI page parser).

function tryText(selector: string, root: Document | Element = document): string {
  return root.querySelector(selector)?.textContent?.trim() ?? "";
}

function normalizeCategory(raw: string): ProductData["category"] {
  if (!raw) return "unknown";
  const lower = raw.toLowerCase();
  if (lower.includes("flower") || lower.includes("bud")) return "flower";
  if (lower.includes("vape") || lower.includes("cartridge") || lower.includes("cart")) return "vape";
  if (lower.includes("edible") || lower.includes("gummy") || lower.includes("chocolate")) return "edible";
  if (lower.includes("concentrate") || lower.includes("wax") || lower.includes("shatter") || lower.includes("rosin")) return "concentrate";
  if (lower.includes("pre-roll") || lower.includes("preroll") || lower.includes("joint")) return "preroll";
  if (lower.includes("tincture")) return "tincture";
  if (lower.includes("topical") || lower.includes("cream") || lower.includes("lotion")) return "topical";
  return "unknown";
}

function normalizeStrainType(raw: string): ProductData["strainType"] | undefined {
  const lower = raw.toLowerCase();
  if (lower.includes("sativa")) return "sativa";
  if (lower.includes("indica")) return "indica";
  if (lower.includes("hybrid")) return "hybrid";
  return undefined;
}

// Schema.org Product markup — most well-built dispensary sites include this
function parseSchemaOrg(): Partial<ProductData> | null {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    try {
      const raw = JSON.parse(script.textContent ?? "{}");
      const items = Array.isArray(raw) ? raw : [raw];
      for (const item of items) {
        if (item["@type"] === "Product") {
          const offers = item.offers ?? {};
          return {
            name: item.name,
            brand: item.brand?.name,
            rawDescription: item.description,
            price: offers.price ? `$${offers.price}` : undefined,
          };
        }
      }
    } catch {
      // Skip malformed JSON-LD
    }
  }
  return null;
}

// Collect visible page text for the AI fallback parser (sent to server)
export function getPageText(): string {
  // Get the main content area if identifiable
  const mainEl =
    document.querySelector("main") ||
    document.querySelector('[role="main"]') ||
    document.querySelector(".product-detail") ||
    document.querySelector("#product-detail") ||
    document.body;

  // Get meaningful text, skipping scripts, styles, nav, footer
  const clone = mainEl.cloneNode(true) as Element;
  clone.querySelectorAll("script, style, nav, footer, header, aside").forEach((el) => el.remove());

  const text = clone.textContent ?? "";
  // Collapse whitespace and limit length
  return text.replace(/\s+/g, " ").trim().slice(0, 3000);
}

export function parseGeneric(): ProductData | null {
  // Try schema.org first
  const schema = parseSchemaOrg();

  // Common product name selectors
  const name =
    schema?.name ||
    tryText('[itemprop="name"]') ||
    tryText(".product-title") ||
    tryText(".product-name") ||
    tryText("#product-title") ||
    tryText("h1");

  if (!name) return null;

  // Category — try common patterns
  const categoryRaw =
    tryText('[itemprop="category"]') ||
    tryText(".product-category") ||
    tryText(".category") ||
    tryText('[class*="category"]') ||
    "";

  const category = normalizeCategory(categoryRaw);

  // Strain type — look for common patterns
  const pageText = document.body.textContent ?? "";
  let strainType: ProductData["strainType"] = undefined;
  if (/\bsativa\b/i.test(pageText)) strainType = "sativa";
  else if (/\bindica\b/i.test(pageText)) strainType = "indica";
  else if (/\bhybrid\b/i.test(pageText)) strainType = "hybrid";

  const strainTypeRaw =
    tryText('[class*="strain-type"]') ||
    tryText('[class*="StrainType"]') ||
    tryText('[class*="genetic"]') ||
    "";
  if (strainTypeRaw) strainType = normalizeStrainType(strainTypeRaw) ?? strainType;

  // THC — look for percentage patterns in text
  const thcMatch = pageText.match(/THC[:\s]*(\d+(?:\.\d+)?)\s*%/i);
  const thc = thcMatch ? `${thcMatch[1]}%` : undefined;

  // CBD
  const cbdMatch = pageText.match(/CBD[:\s]*(\d+(?:\.\d+)?)\s*%/i);
  const cbd = cbdMatch ? `${cbdMatch[1]}%` : undefined;

  // Price
  const price =
    schema?.price ||
    tryText('[itemprop="price"]') ||
    tryText(".price") ||
    tryText('[class*="price"]') ||
    undefined;

  // Brand
  const brand =
    schema?.brand ||
    tryText('[itemprop="brand"]') ||
    tryText(".brand") ||
    undefined;

  // Description
  const rawDescription =
    schema?.rawDescription ||
    tryText('[itemprop="description"]') ||
    tryText(".product-description") ||
    tryText('[class*="description"]') ||
    undefined;

  // COA link
  const coaLink =
    (document.querySelector(
      'a[href*="coa"], a[href*="lab-result"], a[href*="certificate"]'
    ) as HTMLAnchorElement | null)?.href ?? undefined;

  // Detect Dutchie
  const isDutchie =
    !!document.querySelector("[class*='dutchie']") ||
    !!document.querySelector("script[src*='dutchie']") ||
    document.documentElement.innerHTML.includes("dutchie");

  // Detect Jane
  const isJane =
    !!document.querySelector("[class*='iheartjane']") ||
    !!document.querySelector("script[src*='iheartjane']") ||
    document.documentElement.innerHTML.includes("iheartjane");

  const source = isDutchie ? "dutchie" : isJane ? "jane" : "generic";

  return {
    name,
    brand: brand || undefined,
    category,
    strainType,
    thc,
    cbd,
    weight: undefined,
    price: price || undefined,
    dispensary: undefined,
    productUrl: window.location.href,
    source,
    rawDescription: rawDescription || undefined,
    coaLink,
  };
}
