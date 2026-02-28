import React, { useEffect, useState, useCallback } from "react";
import type { ProductData, InsightResponse, UserPreferences } from "../../lib/types";
import {
  getPreferences,
  isAgeVerified,
  getCachedInsight,
  setCachedInsight,
  checkLocalRateLimit,
} from "../../lib/storage";
import { fetchInsight, fetchStrainLookup } from "../../lib/api";
import { OnboardingFlow } from "./OnboardingFlow";
import { InsightPanel } from "./InsightPanel";
import { LoadingState } from "./LoadingState";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  app: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
    background: "#FAFAF8",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #e8e8e4",
    background: "#fff",
    flexShrink: 0,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    textDecoration: "none",
    color: "#2D6A4F",
    fontWeight: 700,
    fontSize: 15,
  },
  homeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666",
    fontSize: 18,
    padding: 4,
    borderRadius: 4,
    lineHeight: 1,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 24,
    textAlign: "center" as const,
    gap: 12,
  },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: 0 },
  emptyText: { fontSize: 13, color: "#666", margin: 0, lineHeight: 1.6 },
  searchArea: { width: "100%", marginTop: 16 },
  searchInput: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
  },
  searchBtn: {
    width: "100%",
    padding: "10px",
    marginTop: 8,
    background: "#2D6A4F",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  rateLimitMsg: {
    padding: "12px 16px",
    background: "#fff7ed",
    borderLeft: "3px solid #f97316",
    margin: 12,
    borderRadius: 6,
    fontSize: 13,
    color: "#7c2d12",
  },
  errorMsg: {
    padding: "12px 16px",
    background: "#fef2f2",
    borderLeft: "3px solid #ef4444",
    margin: 12,
    borderRadius: 6,
    fontSize: 13,
    color: "#7f1d1d",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

type AppState =
  | "checking"
  | "age-gate"
  | "onboarding"
  | "empty"
  | "loading"
  | "result"
  | "error";

export function App() {
  const [appState, setAppState] = useState<AppState>("checking");
  const [product, setProduct] = useState<ProductData | null>(null);
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualQuery, setManualQuery] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);

  // ─── Init ────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function init() {
      const [verified, prefs] = await Promise.all([isAgeVerified(), getPreferences()]);

      if (!verified) {
        setAppState("age-gate");
        return;
      }

      if (!prefs?.onboardingComplete) {
        setAppState("onboarding");
        return;
      }

      setPreferences(prefs);
      setAppState("empty");

      // Check for pending lookup (from context menu)
      const session = await chrome.storage.session.get("pendingLookup");
      if (session.pendingLookup) {
        await chrome.storage.session.remove("pendingLookup");
        handleStrainLookup(session.pendingLookup as string);
      }
    }

    init().catch(console.error);
  }, []);

  // ─── Message Listener (from content script / service worker) ─────────────

  useEffect(() => {
    function handleMessage(message: { type: string; payload?: unknown }) {
      if (message.type === "PRODUCT_DETECTED" && message.payload) {
        handleProductDetected(message.payload as ProductData);
      }
      if (message.type === "HIGHLIGHT_LOOKUP" && message.payload) {
        const { text } = message.payload as { text: string };
        handleStrainLookup(text);
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, [preferences]);

  // ─── Product Detection Handler ────────────────────────────────────────────

  const handleProductDetected = useCallback(
    async (detectedProduct: ProductData) => {
      if (appState === "loading") return;

      setProduct(detectedProduct);

      // Check local cache first
      const cached = await getCachedInsight(detectedProduct.name, detectedProduct.category);
      if (cached) {
        setInsight(cached.data);
        setAppState("result");
        return;
      }

      // Check rate limit
      const { allowed } = await checkLocalRateLimit();
      if (!allowed) {
        setIsRateLimited(true);
        setAppState("empty");
        return;
      }

      setAppState("loading");
      setError(null);

      try {
        const result = await fetchInsight(detectedProduct);
        await setCachedInsight(detectedProduct.name, detectedProduct.category, result);
        setInsight(result);
        setAppState("result");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to get insights";
        setError(msg);
        setAppState("error");
      }
    },
    [appState, preferences]
  );

  // ─── Manual Strain Lookup ─────────────────────────────────────────────────

  const handleStrainLookup = useCallback(
    async (strainName: string) => {
      if (!strainName.trim()) return;

      const { allowed } = await checkLocalRateLimit();
      if (!allowed) {
        setIsRateLimited(true);
        return;
      }

      setAppState("loading");
      setError(null);
      setManualQuery(strainName);

      try {
        const result = await fetchStrainLookup(strainName);
        setInsight(result);
        setAppState("result");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to get insights";
        setError(msg);
        setAppState("error");
      }
    },
    [preferences]
  );

  // ─── Onboarding Complete ──────────────────────────────────────────────────

  const handleOnboardingComplete = useCallback((prefs: UserPreferences) => {
    setPreferences(prefs);
    setAppState("empty");
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────

  if (appState === "checking") {
    return (
      <div style={styles.app}>
        <LoadingState message="Starting up..." />
      </div>
    );
  }

  if (appState === "age-gate" || appState === "onboarding") {
    return (
      <div style={styles.app}>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <a
          href="https://kushsavvy.com"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.logo}
        >
          🌿 KushSavvy
        </a>
        {appState === "result" && (
          <button
            style={styles.homeBtn}
            onClick={() => {
              setAppState("empty");
              setInsight(null);
              setProduct(null);
              setError(null);
            }}
            title="Back to home"
          >
            ×
          </button>
        )}
      </header>

      {/* Rate limit warning */}
      {isRateLimited && (
        <div style={styles.rateLimitMsg}>
          Daily limit reached (50 insights/day). Resets at midnight.
        </div>
      )}

      {/* Loading */}
      {appState === "loading" && (
        <LoadingState message={`Analyzing ${product?.name ?? manualQuery ?? "strain"}...`} />
      )}

      {/* Error */}
      {appState === "error" && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <div style={styles.errorMsg}>
            <strong>Something went wrong</strong>
            <br />
            {error}
          </div>
          <EmptyState onLookup={handleStrainLookup} />
        </div>
      )}

      {/* Result */}
      {appState === "result" && insight && (
        <InsightPanel
          product={product}
          insight={insight}
          preferences={preferences}
        />
      )}

      {/* Empty state */}
      {appState === "empty" && (
        <EmptyState onLookup={handleStrainLookup} />
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onLookup }: { onLookup: (s: string) => void }) {
  const [query, setQuery] = useState("");

  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>💡</div>
      <p style={styles.emptyTitle}>Your AI Budtender</p>
      <p style={styles.emptyText}>
        Browse any product on Weedmaps or Leafly and KushSavvy will automatically analyze it.
        <br /><br />
        Or look up any strain below:
      </p>
      <div style={styles.searchArea}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="e.g. Blue Dream, OG Kush..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) onLookup(query.trim());
          }}
        />
        <button
          style={styles.searchBtn}
          onClick={() => query.trim() && onLookup(query.trim())}
        >
          Get Insights
        </button>
      </div>
    </div>
  );
}
