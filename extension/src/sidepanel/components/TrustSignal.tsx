import React from "react";
import type { InsightResponse } from "../../lib/types";

const CONFIG = {
  verified: {
    icon: "✅",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    color: "#166534",
    label: "Lab Range Verified",
  },
  caution: {
    icon: "⚠️",
    bg: "#fffbeb",
    border: "#fde68a",
    color: "#78350f",
    label: "Heads Up",
  },
  warning: {
    icon: "🚨",
    bg: "#fef2f2",
    border: "#fecaca",
    color: "#7f1d1d",
    label: "Potency Flag",
  },
};

const s = {
  section: {
    padding: "10px 16px",
    marginTop: 6,
  },
  box: (status: string) => {
    const cfg = CONFIG[status as keyof typeof CONFIG] ?? CONFIG.caution;
    return {
      padding: "10px 12px",
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: 8,
      display: "flex",
      alignItems: "flex-start",
      gap: 8,
    };
  },
  icon: { fontSize: 16, flexShrink: 0, lineHeight: 1.4 },
  content: { flex: 1 },
  label: (status: string) => {
    const cfg = CONFIG[status as keyof typeof CONFIG] ?? CONFIG.caution;
    return {
      fontSize: 12,
      fontWeight: 700,
      color: cfg.color,
      margin: "0 0 2px",
    };
  },
  message: {
    fontSize: 12,
    color: "#444",
    margin: 0,
    lineHeight: 1.5,
  },
  details: {
    fontSize: 11,
    color: "#666",
    margin: "4px 0 0",
    fontStyle: "italic" as const,
  },
};

interface TrustSignalProps {
  signal: InsightResponse["trustSignal"];
}

export function TrustSignal({ signal }: TrustSignalProps) {
  const cfg = CONFIG[signal.status] ?? CONFIG.caution;

  return (
    <div style={s.section}>
      <div style={s.box(signal.status)}>
        <span style={s.icon}>{cfg.icon}</span>
        <div style={s.content}>
          <p style={s.label(signal.status)}>{cfg.label}</p>
          <p style={s.message}>{signal.message}</p>
          {signal.details && <p style={s.details}>{signal.details}</p>}
        </div>
      </div>
    </div>
  );
}
