import React from "react";
import type { SimilarStrain } from "../../lib/types";

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
  strainRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #f8f8f4",
    gap: 10,
  },
  strainInfo: { flex: 1 },
  strainName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1a1a1a",
    margin: "0 0 2px",
  },
  strainComparison: {
    fontSize: 12,
    color: "#666",
    margin: 0,
    lineHeight: 1.4,
  },
  shopBtn: {
    padding: "5px 12px",
    border: "1px solid #2D6A4F",
    borderRadius: 6,
    background: "transparent",
    color: "#2D6A4F",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "none",
    whiteSpace: "nowrap" as const,
    display: "inline-block",
  },
};

interface SimilarStrainsProps {
  strains: SimilarStrain[];
}

export function SimilarStrains({ strains }: SimilarStrainsProps) {
  if (strains.length === 0) return null;

  return (
    <div style={s.section}>
      <p style={s.sectionTitle}>You Might Also Like</p>
      {strains.map((strain, i) => (
        <div key={`${strain.name}-${i}`} style={s.strainRow}>
          <div style={s.strainInfo}>
            <p style={s.strainName}>{strain.name}</p>
            <p style={s.strainComparison}>{strain.comparison}</p>
          </div>
          {strain.affiliateLink ? (
            <a
              href={strain.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              style={s.shopBtn}
            >
              Shop →
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}
