import type { ProductData } from "../lib/types";
import { parseWeedmaps } from "./weedmaps";
import { parseLeafly } from "./leafly";
import { parseGeneric, getPageText } from "./generic";

export type { ProductData };

export interface ParseResult {
  product: ProductData | null;
  pageText?: string; // For AI fallback when product is partially parsed
}

/**
 * Detect the current platform and run the appropriate parser.
 * Falls back through platform-specific → generic → null.
 */
export function detectAndParse(): ParseResult {
  const host = window.location.hostname;

  if (host.includes("weedmaps.com")) {
    const product = parseWeedmaps();
    if (product?.name) return { product };
  }

  if (host.includes("leafly.com")) {
    const product = parseLeafly();
    if (product?.name) return { product };
  }

  // Generic parser covers Dutchie, Jane, and arbitrary dispensary sites
  const product = parseGeneric();
  if (product?.name) {
    return {
      product,
      // Include page text for AI enrichment on unknown sites
      pageText: product.source === "generic" ? getPageText() : undefined,
    };
  }

  // No product detected
  return { product: null, pageText: getPageText() };
}

/**
 * Check if the current page looks like a cannabis product page.
 * Quick heuristic to avoid injecting indicators on non-product pages.
 */
export function isProductPage(): boolean {
  const url = window.location.href;
  const host = window.location.hostname;

  // Weedmaps product pages
  if (host.includes("weedmaps.com") && url.includes("/products/")) return true;
  if (host.includes("weedmaps.com") && url.includes("/menu")) return true;

  // Leafly product pages
  if (host.includes("leafly.com") && url.includes("/products")) return true;
  if (host.includes("leafly.com") && url.includes("/menu")) return true;

  // Check for common dispensary/product signals
  const body = document.body.textContent ?? "";
  const hasCannabisProduct =
    /\b(THC|CBD|indica|sativa|hybrid|terpene|cannabis|marijuana)\b/i.test(body) &&
    /\b(price|add to cart|shop now|\$\d+)\b/i.test(body);

  return hasCannabisProduct;
}
