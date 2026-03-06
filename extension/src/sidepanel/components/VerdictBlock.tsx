import React, { useState } from "react";
import type { PuffOrPassScore, UserProfile } from "../../lib/types";
import { addFavorite, removeFavorite, isFavorited, addFeedback, getUserProfile } from "../../lib/storage";
import { debouncedSync } from "../../lib/profileSync";

// ─── Score label colors ───────────────────────────────────────────────────────

function scoreLabelStyle(label: string): { bg: string; color: string; border: string } {
  if (label === "Perfect match") return { bg: "#f0fdf4", color: "#15803d", border: "#86efac" };
  if (label === "Great match") return { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" };
  if (label === "Good fit") return { bg: "#fffbeb", color: "#92400e", border: "#fde68a" };
  if (label === "Decent option") return { bg: "#fffbeb", color: "#b45309", border: "#fcd34d" };
  if (label === "Use caution") return { bg: "#fff7ed", color: "#c2410c", border: "#fdba74" };
  return { bg: "#fef2f2", color: "#b91c1c", border: "#fca5a5" }; // Probably skip
}

function scoreColor(score: number): string {
  if (score >= 75) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#dc2626";
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  block: {
    margin: "0 0 2px",
    background: "#fff",
    borderBottom: "1px solid #f0f0ec",
  },
  scoreRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px 10px",
  },
  scoreLeft: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
  },
  scoreTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  labelBadge: (label: string) => {
    const c = scoreLabelStyle(label);
    return {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 700,
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
    };
  },
  scoreRight: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 2,
  },
  scoreNum: (score: number) => ({
    fontSize: 32,
    fontWeight: 800,
    color: scoreColor(score),
    lineHeight: 1,
  }),
  scoreOf: {
    fontSize: 10,
    color: "#aaa",
  },
  reasons: {
    padding: "0 16px 12px",
  },
  reasonItem: (type: "match" | "watch") => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 6,
    fontSize: 12,
    color: type === "match" ? "#166534" : "#92400e",
    marginBottom: 4,
    lineHeight: 1.4,
  }),
  reasonIcon: (type: "match" | "watch") => ({
    flexShrink: 0,
    marginTop: 1,
    fontSize: 10,
    color: type === "match" ? "#22c55e" : "#f59e0b",
  }),
  coldStart: {
    padding: "12px 16px",
    background: "#f8f8f6",
    borderRadius: 6,
    margin: "0 16px 12px",
    fontSize: 12,
    color: "#666",
    lineHeight: 1.5,
    fontStyle: "italic" as const,
  },
  consensus: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    background: "#fafaf8",
    borderTop: "1px solid #f0f0ec",
    fontSize: 11,
    color: "#666",
  },
  consensusLabel: {
    fontWeight: 600,
    color: "#555",
  },
  actionRow: {
    display: "flex",
    gap: 8,
    padding: "10px 16px",
    borderTop: "1px solid #f0f0ec",
  },
  saveBtn: (saved: boolean) => ({
    flex: 1,
    padding: "7px 10px",
    border: saved ? "1px solid #bbf7d0" : "1px solid #ddd",
    borderRadius: 6,
    background: saved ? "#f0fdf4" : "#fff",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    color: saved ? "#15803d" : "#333",
  }),
  thumbBtn: (active: boolean, type: "up" | "down") => ({
    flex: 1,
    padding: "7px 10px",
    border: active
      ? type === "up" ? "1px solid #bbf7d0" : "1px solid #fca5a5"
      : "1px solid #ddd",
    borderRadius: 6,
    background: active
      ? type === "up" ? "#f0fdf4" : "#fef2f2"
      : "#fff",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  }),
  confidenceBar: (confidence: number) => ({
    height: 3,
    background: `linear-gradient(to right, #2D6A4F ${confidence * 100}%, #e5e7eb ${confidence * 100}%)`,
    borderRadius: 2,
    margin: "0 16px 0",
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────

interface VerdictBlockProps {
  score: PuffOrPassScore | null;
  userProfile: UserProfile | null;
  strainKey: string;
  strainName: string;
  category: string;
  strainType?: string;
  effectTags: string[];
  terpeneTags: string[];
  potencyLevel: string;
  dispensary?: string;
  price?: string;
  productUrl?: string;
  canonical_product_id?: string;
  onFeedbackSent?: (signal: "thumbs_up" | "thumbs_down") => void;
}

export function VerdictBlock({
  score,
  userProfile,
  strainKey,
  strainName,
  category,
  strainType,
  effectTags,
  terpeneTags,
  potencyLevel,
  dispensary,
  price,
  productUrl,
  canonical_product_id,
  onFeedbackSent,
}: VerdictBlockProps) {
  const [saved, setSaved] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<"thumbs_up" | "thumbs_down" | null>(null);

  // Check saved state on mount
  React.useEffect(() => {
    isFavorited(strainKey).then(setSaved).catch(() => setSaved(false));
  }, [strainKey]);

  async function handleSave() {
    if (!userProfile) return;
    if (saved) {
      await removeFavorite(strainKey);
      setSaved(false);
    } else {
      await addFavorite({
        strainKey,
        strainName,
        category,
        strainType,
        effectTags,
        terpeneTags,
        potencyLevel,
        dispensary,
        price,
        productUrl,
        savedAt: Date.now(),
        canonical_product_id,
      });
      setSaved(true);
    }
  }

  async function handleFeedback(signal: "thumbs_up" | "thumbs_down") {
    if (!userProfile || feedback) return;
    setFeedback(signal);
    await addFeedback({
      strainKey,
      strainName,
      signal,
      timestamp: Date.now(),
      strainEffectTags: effectTags,
      strainTerpeneTags: terpeneTags,
      canonical_product_id,
    });
    const updated = await getUserProfile();
    if (updated) {
      debouncedSync(updated);
    }
    onFeedbackSent?.(signal);
  }

  // No profile = cold start
  const noProfile = !userProfile || !userProfile.onboardingComplete;

  return (
    <div style={s.block}>
      {/* Score row */}
      {score && !noProfile ? (
        <>
          <div style={s.scoreRow}>
            <div style={s.scoreLeft}>
              <span style={s.scoreTitle}>Puff or Pass?</span>
              <span style={s.labelBadge(score.personalized.score_label)}>
                {score.personalized.score_label}
              </span>
            </div>
            <div style={s.scoreRight}>
              <span style={s.scoreNum(score.personalized.score)}>
                {score.personalized.score}
              </span>
              <span style={s.scoreOf}>/ 100</span>
            </div>
          </div>

          {/* Confidence bar */}
          <div style={s.confidenceBar(score.personalized.confidence)} />

          {/* Reasons */}
          {(score.personalized.why_it_matches.length > 0 || score.personalized.watch_out_for.length > 0) && (
            <div style={s.reasons}>
              {score.personalized.why_it_matches.slice(0, 3).map((r, i) => (
                <div key={i} style={s.reasonItem("match")}>
                  <span style={s.reasonIcon("match")}>✓</span>
                  <span>{r}</span>
                </div>
              ))}
              {score.personalized.watch_out_for.slice(0, 2).map((r, i) => (
                <div key={i} style={s.reasonItem("watch")}>
                  <span style={s.reasonIcon("watch")}>⚠</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}

          {/* Consensus */}
          {score.consensus && (
            <div style={s.consensus}>
              <span style={s.consensusLabel}>Community:</span>
              <span>{score.consensus.score}/100</span>
              <span style={{ color: "#aaa" }}>·</span>
              <span>{score.consensus.sample_size} reviews</span>
              {score.consensus.top_reasons[0] && (
                <>
                  <span style={{ color: "#aaa" }}>·</span>
                  <span style={{ fontStyle: "italic" }}>{score.consensus.top_reasons[0]}</span>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: "14px 16px 0" }}>
          <span style={{ ...s.scoreTitle }}>Puff or Pass?</span>
          <div style={s.coldStart}>
            Complete your profile to get a personalized match score — we'll compare this product to your effects, terpene preferences, and potency tolerance.
          </div>
        </div>
      )}

      {/* Actions: Save + thumbs */}
      <div style={s.actionRow}>
        <button
          style={s.saveBtn(saved === true)}
          onClick={handleSave}
          disabled={!userProfile}
          title={saved ? "Remove from saved" : "Save to favorites"}
        >
          {saved ? "❤️ Saved" : "🤍 Save"}
        </button>
        <button
          style={s.thumbBtn(feedback === "thumbs_up", "up")}
          onClick={() => handleFeedback("thumbs_up")}
          disabled={!!feedback || !userProfile}
          title="Good match"
        >
          👍
        </button>
        <button
          style={s.thumbBtn(feedback === "thumbs_down", "down")}
          onClick={() => handleFeedback("thumbs_down")}
          disabled={!!feedback || !userProfile}
          title="Not for me"
        >
          👎
        </button>
      </div>
    </div>
  );
}
