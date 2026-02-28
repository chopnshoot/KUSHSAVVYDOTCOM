import React, { useState } from "react";
import type { InsightResponse, ProductData } from "../../lib/types";

const LEVEL_CONFIG = {
  strong: { label: "Strong", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  moderate: { label: "Moderate", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  mild: { label: "Mild", color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
};

const s = {
  section: {
    padding: "14px 16px",
    borderBottom: "1px solid #f0f0ec",
    background: "#fff",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    margin: "0 0 10px",
  },
  levelBadge: (level: string) => {
    const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] ?? LEVEL_CONFIG.moderate;
    return {
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 700,
      background: config.bg,
      color: config.color,
      border: `1px solid ${config.border}`,
      marginBottom: 10,
    };
  },
  doseTabs: {
    display: "flex",
    gap: 4,
    marginBottom: 10,
  },
  tab: (active: boolean) => ({
    padding: "5px 12px",
    borderRadius: 6,
    border: "none",
    background: active ? "#2D6A4F" : "#f0f0ec",
    color: active ? "#fff" : "#555",
    fontSize: 12,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  }),
  doseText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 1.6,
    margin: 0,
    padding: "10px",
    background: "#fafaf8",
    borderRadius: 6,
  },
};

type DoseLevel = "beginner" | "regular" | "experienced";

interface DosingProps {
  dosing: InsightResponse["dosing"];
  productType?: ProductData["category"];
}

export function DosingSection({ dosing, productType }: DosingProps) {
  const [activeLevel, setActiveLevel] = useState<DoseLevel>("beginner");

  const doseText = {
    beginner: dosing.beginner,
    regular: dosing.regular,
    experienced: dosing.experienced,
  };

  return (
    <div style={s.section}>
      <p style={s.sectionTitle}>Dosing Guide</p>
      <span style={s.levelBadge(dosing.level)}>
        {LEVEL_CONFIG[dosing.level]?.label ?? dosing.level} potency
      </span>

      <div style={s.doseTabs}>
        {(["beginner", "regular", "experienced"] as DoseLevel[]).map((level) => (
          <button
            key={level}
            style={s.tab(activeLevel === level)}
            onClick={() => setActiveLevel(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      <p style={s.doseText}>{doseText[activeLevel]}</p>

      {productType === "edible" && (
        <p
          style={{
            fontSize: 11,
            color: "#888",
            marginTop: 8,
            padding: "6px 8px",
            background: "#fffbeb",
            borderRadius: 4,
          }}
        >
          ⏰ Edibles take 30–90 min to kick in. Always wait before taking more.
        </p>
      )}
    </div>
  );
}
