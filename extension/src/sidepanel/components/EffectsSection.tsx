import React, { useState } from "react";
import type { InsightResponse } from "../../lib/types";

const s = {
  section: {
    padding: "14px 16px",
    borderBottom: "1px solid #f0f0ec",
    background: "#fff",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    margin: "0 0 10px",
  },
  summary: {
    fontSize: 13,
    color: "#333",
    lineHeight: 1.6,
    margin: "0 0 10px",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
    marginBottom: 8,
  },
  tag: (color: string, bg: string) => ({
    padding: "3px 10px",
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    background: bg,
    color,
  }),
  cautionBox: {
    marginTop: 8,
    padding: "8px 10px",
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 6,
    fontSize: 12,
    color: "#78350f",
  },
  expandBtn: {
    background: "none",
    border: "none",
    fontSize: 12,
    color: "#2D6A4F",
    cursor: "pointer",
    padding: 0,
    fontFamily: "inherit",
    marginTop: 4,
  },
};

interface EffectsSectionProps {
  effects: InsightResponse["effects"];
}

export function EffectsSection({ effects }: EffectsSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={s.section}>
      <p style={s.sectionTitle}>Effects</p>
      <p style={s.summary}>{effects.summary}</p>

      {/* Primary effects tags */}
      <div style={s.tagRow}>
        {effects.primary.map((effect) => (
          <span key={effect} style={s.tag("#166534", "#f0fdf4")}>
            {effect}
          </span>
        ))}
      </div>

      {/* Best for — expanded */}
      {expanded && effects.bestFor.length > 0 && (
        <>
          <p style={{ fontSize: 11, color: "#888", margin: "8px 0 4px", fontWeight: 600 }}>
            BEST FOR
          </p>
          <div style={s.tagRow}>
            {effects.bestFor.map((use) => (
              <span key={use} style={s.tag("#1e40af", "#eff6ff")}>
                {use}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Cautions */}
      {effects.caution.length > 0 && expanded && (
        <div style={s.cautionBox}>
          ⚠️ {effects.caution.join(" · ")}
        </div>
      )}

      <button style={s.expandBtn} onClick={() => setExpanded((p) => !p)}>
        {expanded ? "Show less ↑" : `Show best uses & cautions ↓`}
      </button>
    </div>
  );
}
