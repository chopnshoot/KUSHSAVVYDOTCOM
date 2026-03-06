import React from "react";
import type { ProductData, StrainProfile, PuffOrPassScore, UserProfile } from "../../lib/types";
import { EffectsSection } from "./EffectsSection";
import { TerpenesSection } from "./TerpenesSection";
import { DosingSection } from "./DosingSection";
import { SimilarStrains } from "./SimilarStrains";
import { TrustSignal } from "./TrustSignal";
import { VerdictBlock } from "./VerdictBlock";

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
    margin: "0 0 6px",
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
  potencyBadge: (level: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      mild: { bg: "#f0fdf4", color: "#166534" },
      moderate: { bg: "#fffbeb", color: "#92400e" },
      strong: { bg: "#fff7ed", color: "#c2410c" },
      very_strong: { bg: "#fef2f2", color: "#b91c1c" },
    };
    const c = colors[level] ?? { bg: "#f5f5f5", color: "#555" };
    return {
      padding: "2px 8px",
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      background: c.bg,
      color: c.color,
    };
  },
  thcBadge: {
    padding: "2px 8px",
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    background: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
  },
  dispensary: {
    fontSize: 11,
    color: "#888",
  },
  actions: {
    display: "flex",
    gap: 8,
    padding: "8px 16px",
    borderBottom: "1px solid #f0f0ec",
    background: "#fafaf8",
  },
  actionBtn: {
    flex: 1,
    padding: "6px 10px",
    border: "1px solid #ddd",
    borderRadius: 6,
    background: "#fff",
    fontSize: 11,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "#333",
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
};

// ─── Strain type colors ───────────────────────────────────────────────────────

const strainColors: Record<string, string> = {
  sativa: "#c2410c",
  indica: "#15803d",
  hybrid: "#7c3aed",
};

const potencyLabels: Record<string, string> = {
  mild: "Mild",
  moderate: "Moderate",
  strong: "Strong",
  very_strong: "Very Strong",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface InsightPanelProps {
  product: ProductData | null;
  insight: StrainProfile;
  puffOrPassScore: PuffOrPassScore | null;
  userProfile: UserProfile | null;
  canonicalProductId?: string;
}

export function InsightPanel({
  product,
  insight,
  puffOrPassScore,
  userProfile,
  canonicalProductId,
}: InsightPanelProps) {
  const name = product?.name ?? "This strain";
  const strainKey = `${name.toLowerCase().replace(/\s+/g, "_")}:${product?.category ?? "unknown"}`;

  const weedmapsLink = insight.similar?.[0]?.affiliateLink;

  return (
    <div style={s.panel}>
      {/* Product Header */}
      <div style={s.productHeader}>
        <h2 style={s.productName}>{name}</h2>
        <div style={s.productMeta}>
          {product?.strainType && (
            <span style={s.badge(strainColors[product.strainType] ?? "#555")}>
              {product.strainType.charAt(0).toUpperCase() + product.strainType.slice(1)}
            </span>
          )}
          {insight.potencyLevel && (
            <span style={s.potencyBadge(insight.potencyLevel)}>
              {potencyLabels[insight.potencyLevel] ?? insight.potencyLevel}
            </span>
          )}
          {product?.thc && <span style={s.thcBadge}>THC {product.thc}</span>}
          {product?.cbd && <span style={s.thcBadge}>CBD {product.cbd}</span>}
          {product?.dispensary && (
            <span style={s.dispensary}>@ {product.dispensary}</span>
          )}
        </div>
      </div>

      {/* Puff or Pass Verdict — verdict-first layout */}
      <VerdictBlock
        score={puffOrPassScore}
        userProfile={userProfile}
        strainKey={strainKey}
        strainName={name}
        category={product?.category ?? "unknown"}
        strainType={product?.strainType}
        effectTags={insight.effectTags ?? []}
        terpeneTags={insight.terpeneTags ?? []}
        potencyLevel={insight.potencyLevel ?? "moderate"}
        dispensary={product?.dispensary}
        price={product?.price}
        productUrl={product?.productUrl}
        canonical_product_id={canonicalProductId}
      />

      {/* Quick actions */}
      {(weedmapsLink || product?.coaLink) && (
        <div style={s.actions}>
          {weedmapsLink && (
            <a
              href={weedmapsLink}
              target="_blank"
              rel="noopener noreferrer"
              style={s.actionBtn}
            >
              🔍 Find Nearby
            </a>
          )}
          {product?.coaLink && (
            <a
              href={product.coaLink}
              target="_blank"
              rel="noopener noreferrer"
              style={s.actionBtn}
            >
              📋 Lab Report
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
        </div>
      )}

      {/* Content sections */}
      <div style={s.sections}>
        {/* Trust signal */}
        <TrustSignal signal={insight.trustSignal} />

        {/* Effects */}
        <EffectsSection effects={insight.effects} />

        {/* Terpenes */}
        <TerpenesSection terpenes={insight.terpenes} />

        {/* Dosing */}
        <DosingSection dosing={insight.dosing} productType={product?.category} />

        {/* Similar strains */}
        {insight.similar && insight.similar.length > 0 && (
          <SimilarStrains strains={insight.similar} />
        )}
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
          Terpene Guide
        </a>
        {" · "}
        <span style={{ color: "#ccc" }}>{insight.cached ? "cached" : "live"}</span>
      </div>
    </div>
  );
}
