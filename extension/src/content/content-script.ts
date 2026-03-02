// KushSavvy Content Script
// Runs on: Weedmaps, Leafly, and generic dispensary pages
// Responsibilities: detect products, inject insight indicators, relay messages

import { detectAndParse, isProductPage } from "../parsers";
import type { ProductData } from "../lib/types";

// ─── State ────────────────────────────────────────────────────────────────────

let currentProduct: ProductData | null = null;
let indicatorsInjected = false;

// ─── Product Detection ────────────────────────────────────────────────────────

function detectProduct(): void {
  if (!isProductPage()) return;

  const { product } = detectAndParse();
  if (!product) return;

  currentProduct = product;

  // Store product in session storage so the side panel can access it
  chrome.storage.session
    .set({ [`product_${getTabId()}`]: product })
    .catch(console.error);

  // Notify service worker / side panel
  chrome.runtime.sendMessage({ type: "PRODUCT_DETECTED", payload: product }).catch(() => {
    // Side panel may not be open yet — that's fine
  });

  // Inject visual indicator if not already present
  if (!indicatorsInjected) {
    injectIndicators(product);
    indicatorsInjected = true;
  }
}

// ─── Tab ID ───────────────────────────────────────────────────────────────────

// We don't have direct access to tab ID in content scripts,
// so we use a workaround via the URL hash-based key approach
function getTabId(): string {
  // Use a combination of hostname + pathname as a proxy key
  return `${window.location.hostname}${window.location.pathname}`.replace(/[^a-z0-9]/gi, "_");
}

// ─── Visual Indicators ────────────────────────────────────────────────────────

function injectIndicators(product: ProductData): void {
  // Find product name headings and add a KushSavvy indicator button
  const headings = document.querySelectorAll("h1, h2[class*='product'], h1[class*='product']");

  for (const heading of headings) {
    if (heading.textContent?.includes(product.name.slice(0, 10))) {
      if (heading.querySelector(".kushsavvy-indicator")) continue;

      const indicator = document.createElement("button");
      indicator.className = "kushsavvy-indicator";
      indicator.setAttribute("aria-label", "Get KushSavvy insights");
      indicator.setAttribute("title", "Get AI insights from KushSavvy");
      indicator.innerHTML = `
        <span style="
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-left: 8px;
          padding: 3px 8px;
          background: #2D6A4F;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 11px;
          font-family: system-ui, sans-serif;
          font-weight: 600;
          cursor: pointer;
          vertical-align: middle;
          letter-spacing: 0.3px;
        ">
          💡 KushSavvy
        </span>
      `;

      indicator.style.cssText =
        "background: none; border: none; padding: 0; cursor: pointer; vertical-align: middle;";

      indicator.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openSidePanel();
      });

      heading.appendChild(indicator);
    }
  }
}

function openSidePanel(): void {
  chrome.runtime.sendMessage({ type: "OPEN_SIDE_PANEL" }).catch(console.error);
}

// ─── SPA Navigation Detection ─────────────────────────────────────────────────
// Weedmaps and Leafly are React SPAs — we need to re-detect on route changes

let lastUrl = window.location.href;

function observeNavigation(): void {
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      indicatorsInjected = false;
      currentProduct = null;
      // Debounce detection to let the new page render
      setTimeout(detectProduct, 800);
    }
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
  });
}

// ─── Message Listener ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_CURRENT_PRODUCT") {
    sendResponse({ product: currentProduct });
  }
  return true;
});

// ─── Init ─────────────────────────────────────────────────────────────────────

// Initial detection with a small delay to let the page render
setTimeout(detectProduct, 500);
observeNavigation();

// Also watch for DOM mutations that might signal a product page load
const domObserver = new MutationObserver(() => {
  if (!currentProduct && isProductPage()) {
    detectProduct();
  }
});

domObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// Stop watching once we've found a product
const stopWatching = setInterval(() => {
  if (currentProduct) {
    domObserver.disconnect();
    clearInterval(stopWatching);
  }
}, 2000);
