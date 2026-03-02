import React, { useState } from "react";
import type { ProductData, InsightResponse, UserPreferences } from "../../lib/types";
import { EffectsSection } from "./EffectsSection";
import { TerpenesSection } from "./TerpenesSection";
import { DosingSection } from "./DosingSection";
import { MatchScore } from "./MatchScore";
import { SimilarStrains } from "./SimilarStrains";
import { TrustSignal } from "./TrustSignal";

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  panel: {
    flex: 1,
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
  },
  productHeader: {
    padding: "14px 16px 12px",
    background: "#fff",
    borderBottom: "1px solid #f0f0ec",
  },
  productName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1a1a1a",
    margin: "0 0 4px",
  },
  productMeta: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
    alignItems: "center",
  },
  badge: (color: string) => ({
    padding: "2px 8px",
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    background: color,
    color: "#fff",
    whiteSpace: "nowrap" as const,
  }),
  thcBadge: {
    padding: "2px 8px",
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    background: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
  },
  actions: {
    display: "flex",
    gap: 8,
    padding: "10px 16px",
    borderBottom: "1px solid #f0f0ec",
    background: "#fafaf8",
  },
  actionBtn: {
    flex: 1,
    padding: "7px 10px",
    border: "1px solid #ddd",
    borderRadius: 6,
    background: "#fff",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "#333",
    textAlign: "center" as const,
    textDecoration: "none",
    display: "block",
  },
  actionBtnGreen: {
    flex: 1,
    padding: "7px 10px",
    border: "1px solid #2D6A4F",
    borderRadius: 6,
    background: "#2D6A4F",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "#fff",
    textAlign: "center" as const,
    textDecoration: "none",
    display: "block",
  },
  sections: {
    flex: 1,
    padding: "0 0 16px",
  },
  footer: {
    padding: "12px 16px",
    textAlign: "center" as const,
    fontSize: 11,
    color: "#aaa",
    borderTop: "1px solid #f0f0ec",
  },
  feedbackRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: "10px 16px",
    background: "#fafaf8",
    borderTop: "1px solid #f0f0ec",
    fontSize: 12,
    color: "#666",
  },
  thumbBtn: (active: boolean) => ({
    background: active ? "#f0fdf4" : "none",
    border: active ? "1px solid #bbf7d0" : "1px solid #e5e5e5",
    borderRadius: 6,
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: 16,
  }),
};

// ─── Strain type colors ───────────────────────────────────────────────────────

const strainColors: Record<string, string> = {
  sativa: "#c2410c",
  indica: "#15803d",
  hybrid: "#7c3aed",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface InsightPanelProps {
  product: ProductData | null;
  insight: InsightResponse;
  preferences: UserPreferences | null;
}

export function InsightPanel({ product, insight, preferences }: InsightPanelProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const name = product?.name ?? "This strain";
  const dispensary = product?.dispensary;
  const source = product?.source;
  const thc = product?.thc;
  const cbd = product?.cbd;
  const strainType = product?.strainType;

  const weedmapsLink = insight.similar?.[0]?.affiliateLink;

  return (
    <div style={s.panel}>
      {/* Product Header */}
      <div style={s.productHeader}>
        <h2 style={s.productName}>{name}</h2>
        <div style={s.productMeta}>
          {strainType && (
            <span style={s.badge(strainColors[strainType] ?? "#555")}>
              {strainType.charAt(0).toUpperCase() + strainType.slice(1)}
            </span>
          )}
          {thc && <span style={s.thcBadge}>THC {thc}</span>}
          {cbd && <span style={s.thcBadge}>CBD {cbd}</span>}
          {dispensary && (
            <span style={{ fontSize: 11, color: "#888" }}>@ {dispensary}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={s.actions}>
        {weedmapsLink && (
          <a
            href={weedmapsLink}
            target="_blank"
            rel="noopener noreferrer"
            style={s.actionBtnGreen}
          >
            🔍 Find Nearby
          </a>
        )}
        {insight.shareUrl && (
          <a
            href={`https://kushsavvy.com${insight.shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            style={s.actionBtn}
          >
            🔗 Share
          </a>
        )}
        {product?.coaLink && (
          <a
            href={product.coaLink}
            target="_blank"
            rel="noopener noreferrer"
            style={s.actionBtn}
          >
            📋 View COA
          </a>
        )}
      </div>

      {/* Sections */}
      <div style={s.sections}>
        {/* Trust Signal — top of page, most important */}
        <TrustSignal signal={insight.trustSignal} />

        {/* Match Score — personal, show early */}
        {insight.matchScore && (
          <MatchScore score={insight.matchScore} />
        )}

        {/* Effects */}
        <EffectsSection effects={insight.effects} />

        {/* Terpenes */}
        <TerpenesSection terpenes={insight.terpenes} />

        {/* Dosing */}
        <DosingSection dosing={insight.dosing} productType={product?.category} />

        {/* Similar Strains */}
        {insight.similar.length > 0 && (
          <SimilarStrains strains={insight.similar} />
        )}
      </div>

      {/* Feedback */}
      <div style={s.feedbackRow}>
        <span>Was this helpful?</span>
        <button style={s.thumbBtn(feedback === "up")} onClick={() => setFeedback("up")}>👍</button>
        <button style={s.thumbBtn(feedback === "down")} onClick={() => setFeedback("down")}>👎</button>
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <a
          href="https://kushsavvy.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2D6A4F", textDecoration: "none" }}
        >
          Powered by KushSavvy
        </a>
        {" · "}
        <a
          href="https://kushsavvy.com/learn/terpenes"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#aaa", textDecoration: "none" }}
        >
          Learn about terpenes
        </a>
        {" · "}
        <span style={{ color: "#ccc" }}>
          {insight.cached ? "cached" : "live"}
        </span>
      </div>
    </div>
  );
}
