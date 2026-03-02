import React from "react";
import type { InsightResponse } from "../../lib/types";

function scoreColor(score: number): { bg: string; color: string; border: string } {
  if (score >= 80) return { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" };
  if (score >= 60) return { bg: "#fffbeb", color: "#78350f", border: "#fde68a" };
  return { bg: "#fef2f2", color: "#7f1d1d", border: "#fecaca" };
}

function scoreEmoji(score: number): string {
  if (score >= 85) return "🟢";
  if (score >= 70) return "🟡";
  return "🔴";
}

const s = {
  section: {
    padding: "12px 16px",
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
    margin: "0 0 8px",
  },
  scoreBox: (score: number) => ({
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${scoreColor(score).border}`,
    background: scoreColor(score).bg,
    display: "flex",
    alignItems: "center",
    gap: 10,
  }),
  scoreNum: (score: number) => ({
    fontSize: 22,
    fontWeight: 800,
    color: scoreColor(score).color,
    flexShrink: 0,
  }),
  scoreLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#333",
    marginBottom: 2,
  },
  reasonsList: {
    margin: "8px 0 0",
    padding: "0 0 0 14px",
    fontSize: 12,
    color: "#555",
    lineHeight: 1.6,
  },
  mismatchBox: {
    marginTop: 8,
    padding: "6px 10px",
    background: "#fff7ed",
    borderRadius: 6,
    fontSize: 12,
    color: "#7c2d12",
    lineHeight: 1.5,
  },
};

interface MatchScoreProps {
  score: NonNullable<InsightResponse["matchScore"]>;
}

export function MatchScore({ score }: MatchScoreProps) {
  return (
    <div style={s.section}>
      <p style={s.sectionTitle}>Your Match</p>
      <div style={s.scoreBox(score.score)}>
        <div style={s.scoreNum(score.score)}>
          {scoreEmoji(score.score)} {score.score}%
        </div>
        <div>
          <div style={s.scoreLabel}>
            {score.score >= 85 ? "Strong match" : score.score >= 70 ? "Good match" : "Partial match"}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            Based on your preferences
          </div>
        </div>
      </div>

      {score.reasons.length > 0 && (
        <ul style={s.reasonsList}>
          {score.reasons.map((r) => (
            <li key={r}>✓ {r}</li>
          ))}
        </ul>
      )}

      {score.mismatches.length > 0 && (
        <div style={s.mismatchBox}>
          ⚠️ {score.mismatches.join(" · ")}
        </div>
      )}
    </div>
  );
}
