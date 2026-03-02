import React, { useState } from "react";
import type { InsightResponse, TerpeneDetail } from "../../lib/types";

// Terpene emoji mapping
const TERPENE_EMOJIS: Record<string, string> = {
  myrcene: "🌿",
  pinene: "🌲",
  limonene: "🍋",
  linalool: "💜",
  caryophyllene: "🌶️",
  humulene: "🍺",
  ocimene: "🌸",
  terpinolene: "🍎",
  bisabolol: "🌼",
  valencene: "🍊",
  geraniol: "🌹",
  eucalyptol: "🌿",
};

function getTerpeneEmoji(name: string): string {
  return TERPENE_EMOJIS[name.toLowerCase()] ?? "🌱";
}

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
  terpeneRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "8px 0",
    borderBottom: "1px solid #f8f8f4",
  },
  emoji: { fontSize: 18, flexShrink: 0, marginTop: 1 },
  terpeneInfo: { flex: 1 },
  terpeneName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1a1a1a",
    margin: "0 0 2px",
  },
  terpeneAroma: {
    fontSize: 11,
    color: "#888",
    margin: "0 0 2px",
  },
  terpeneEffect: {
    fontSize: 12,
    color: "#444",
    margin: 0,
    lineHeight: 1.5,
  },
  percentage: {
    fontSize: 11,
    color: "#888",
    fontWeight: 600,
    flexShrink: 0,
    alignSelf: "center" as const,
  },
  explanation: {
    marginTop: 10,
    padding: "10px",
    background: "#f0fdf4",
    borderRadius: 6,
    fontSize: 12,
    color: "#166534",
    lineHeight: 1.6,
  },
  expandBtn: {
    background: "none",
    border: "none",
    fontSize: 12,
    color: "#2D6A4F",
    cursor: "pointer",
    padding: 0,
    fontFamily: "inherit",
    marginTop: 8,
    display: "block",
  },
};

interface TerpenesSectionProps {
  terpenes: InsightResponse["terpenes"];
}

export function TerpenesSection({ terpenes }: TerpenesSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? terpenes.dominant : terpenes.dominant.slice(0, 3);

  return (
    <div style={s.section}>
      <p style={s.sectionTitle}>Terpenes</p>

      {displayed.map((t, i) => (
        <TerpeneRow key={`${t.name}-${i}`} terpene={t} />
      ))}

      {terpenes.dominant.length > 3 && (
        <button style={s.expandBtn} onClick={() => setShowAll((p) => !p)}>
          {showAll
            ? "Show less ↑"
            : `+ ${terpenes.dominant.length - 3} more terpenes ↓`}
        </button>
      )}

      {terpenes.explanation && (
        <div style={s.explanation}>{terpenes.explanation}</div>
      )}
    </div>
  );
}

function TerpeneRow({ terpene }: { terpene: TerpeneDetail }) {
  return (
    <div style={s.terpeneRow}>
      <span style={s.emoji}>{getTerpeneEmoji(terpene.name)}</span>
      <div style={s.terpeneInfo}>
        <p style={s.terpeneName}>{terpene.name}</p>
        {terpene.aroma && <p style={s.terpeneAroma}>{terpene.aroma} aroma</p>}
        <p style={s.terpeneEffect}>{terpene.effect}</p>
      </div>
      {terpene.percentage && (
        <span style={s.percentage}>{terpene.percentage}</span>
      )}
    </div>
  );
}
