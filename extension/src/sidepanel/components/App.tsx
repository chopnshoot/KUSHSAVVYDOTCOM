import React, { useEffect, useState, useCallback } from "react";
import type { ProductData, StrainProfile, PuffOrPassScore, UserProfile } from "../../lib/types";
import {
  getUserProfile,
  saveUserProfile,
  isAgeVerified,
  getCachedStrainProfile,
  setCachedStrainProfile,
  checkLocalRateLimit,
} from "../../lib/storage";
import { fetchInsight, fetchStrainLookup, sendPageCapture } from "../../lib/api";
import { restoreProfileFromServer } from "../../lib/profileSync";
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
    boxSizing: "border-box" as const,
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
  const [strainProfile, setStrainProfile] = useState<StrainProfile | null>(null);
  const [puffOrPassScore, setPuffOrPassScore] = useState<PuffOrPassScore | null>(null);
  const [canonicalProductId, setCanonicalProductId] = useState<string | undefined>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualQuery, setManualQuery] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);

  // ─── Init ────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function init() {
      const [verified, profile] = await Promise.all([isAgeVerified(), getUserProfile()]);

      if (!verified) {
        setAppState("age-gate");
        return;
      }

      if (!profile?.onboardingComplete) {
        // Try restoring from server (reinstall recovery)
        const restored = await restoreProfileFromServer().catch(() => null);
        if (restored?.onboardingComplete) {
          await saveUserProfile(restored);
          setUserProfile(restored);
          setAppState("empty");
          return;
        }
        setAppState("onboarding");
        return;
      }

      setUserProfile(profile);
      setAppState("empty");

      // Check for pending highlight lookup (from context menu)
      const session = await chrome.storage.session.get("pendingLookup").catch(() => ({}));
      if ((session as Record<string, unknown>).pendingLookup) {
        await chrome.storage.session.remove("pendingLookup").catch(() => {});
        handleStrainLookup((session as Record<string, unknown>).pendingLookup as string);
      }
    }

    init().catch(console.error);
  }, []);

  // ─── Message Listener ─────────────────────────────────────────────────────

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
  }, [userProfile]);

  // ─── Product Detection Handler ────────────────────────────────────────────

  const handleProductDetected = useCallback(
    async (detectedProduct: ProductData) => {
      if (appState === "loading") return;

      setProduct(detectedProduct);
      setPuffOrPassScore(null);
      setCanonicalProductId(undefined);

      // Check local cache for StrainProfile
      const cached = await getCachedStrainProfile(detectedProduct.name, detectedProduct.category);
      if (cached) {
        setStrainProfile(cached.data);
        setAppState("result");
        // Still send page capture in background to get personalized score
        sendPageCapture(detectedProduct).then((res) => {
          if (res.score) setPuffOrPassScore(res.score);
          if (res.canonical_product_id) setCanonicalProductId(res.canonical_product_id);
        }).catch(() => {});
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

      // Fire page capture (non-blocking) — gets canonical_product_id + personalized score
      sendPageCapture(detectedProduct).then((res) => {
        if (res.score) setPuffOrPassScore(res.score);
        if (res.canonical_product_id) setCanonicalProductId(res.canonical_product_id);
      }).catch(() => {});

      // Fetch AI strain profile
      try {
        const profile = await fetchInsight(detectedProduct);
        await setCachedStrainProfile(detectedProduct.name, detectedProduct.category, profile);
        setStrainProfile(profile);
        setAppState("result");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to get insights";
        setError(msg);
        setAppState("error");
      }
    },
    [appState, userProfile]
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
      setProduct(null);
      setPuffOrPassScore(null);
      setCanonicalProductId(undefined);

      try {
        const profile = await fetchStrainLookup(strainName);
        setStrainProfile(profile);
        setAppState("result");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to get insights";
        setError(msg);
        setAppState("error");
      }
    },
    [userProfile]
  );

  // ─── Onboarding Complete ──────────────────────────────────────────────────

  const handleOnboardingComplete = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
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
              setStrainProfile(null);
              setPuffOrPassScore(null);
              setProduct(null);
              setError(null);
              setCanonicalProductId(undefined);
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
      {appState === "result" && strainProfile && (
        <InsightPanel
          product={product}
          insight={strainProfile}
          puffOrPassScore={puffOrPassScore}
          userProfile={userProfile}
          canonicalProductId={canonicalProductId}
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
