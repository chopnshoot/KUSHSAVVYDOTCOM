// KushSavvy Background Service Worker (Manifest V3)
// Handles: side panel control, context menu, tab state tracking

import type { ExtensionMessage, GetInsightMessage, HighlightLookupMessage } from "../lib/types";

// ─── Side Panel ───────────────────────────────────────────────────────────────

// Open the side panel when the extension icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error);

// ─── Context Menu ─────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "kushsavvy-lookup",
    title: 'Look up "%s" on KushSavvy',
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "kushsavvy-lookup" || !tab?.id) return;

  const selectedText = info.selectionText?.trim();
  if (!selectedText) return;

  // Open the side panel with the selected text as a lookup
  chrome.sidePanel.open({ tabId: tab.id }).then(() => {
    // Small delay to let the panel initialize
    setTimeout(() => {
      chrome.runtime
        .sendMessage({
          type: "HIGHLIGHT_LOOKUP",
          payload: { text: selectedText },
        } satisfies HighlightLookupMessage)
        .catch(() => {
          // Panel may not be ready yet; it will read from storage on open
        });
    }, 500);
  });

  // Also store in session storage so the panel can pick it up on open
  chrome.storage.session
    .set({ pendingLookup: selectedText })
    .catch(console.error);
});

// ─── Message Handling ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, sender, sendResponse) => {
    if (message.type === "OPEN_SIDE_PANEL") {
      const tabId = sender.tab?.id;
      if (tabId) {
        chrome.sidePanel.open({ tabId }).catch(console.error);
      }
      sendResponse({ ok: true });
    }

    // Return true to keep the message channel open for async responses
    return true;
  }
);

// ─── Tab Navigation Tracking ──────────────────────────────────────────────────
// Clear pending product data when the user navigates to a new page

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    // Clear any product data cached for this tab's previous page
    chrome.storage.session.remove([`product_${tabId}`]).catch(console.error);
  }
});

console.log("KushSavvy service worker initialized");
