import React, { useEffect, useState } from "react";
import { getPreferences, checkLocalRateLimit } from "../lib/storage";
import type { UserPreferences } from "../lib/types";

const s = {
  container: { padding: 16 },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  logo: {
    fontSize: 20,
    color: "#2D6A4F",
    fontWeight: 700,
    margin: 0,
  },
  tagline: { fontSize: 11, color: "#888", margin: 0 },
  openBtn: {
    width: "100%",
    padding: "11px",
    background: "#2D6A4F",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    marginBottom: 12,
  },
  statsRow: {
    display: "flex",
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    padding: "8px",
    background: "#f0fdf4",
    borderRadius: 6,
    textAlign: "center" as const,
  },
  statNum: { fontSize: 18, fontWeight: 800, color: "#2D6A4F", display: "block" },
  statLabel: { fontSize: 10, color: "#888", display: "block", marginTop: 1 },
  linkRow: {
    display: "flex",
    gap: 8,
    borderTop: "1px solid #f0f0ec",
    paddingTop: 10,
    marginTop: 4,
  },
  link: {
    flex: 1,
    fontSize: 11,
    color: "#2D6A4F",
    textDecoration: "none",
    textAlign: "center" as const,
    cursor: "pointer",
  },
  settingsLink: {
    display: "block",
    textAlign: "center" as const,
    fontSize: 11,
    color: "#999",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontFamily: "inherit",
    marginBottom: 10,
    padding: 0,
  },
};

export function PopupApp() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [remaining, setRemaining] = useState<number>(50);

  useEffect(() => {
    async function load() {
      const [p, rateLimit] = await Promise.all([
        getPreferences(),
        checkLocalRateLimit(),
      ]);
      setPrefs(p);
      setRemaining(rateLimit.remaining);
    }
    load().catch(console.error);
  }, []);

  function openSidePanel() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) {
        chrome.sidePanel.open({ tabId }).catch(console.error);
        window.close();
      }
    });
  }

  function openSettings() {
    chrome.runtime.openOptionsPage?.() ??
      chrome.tabs.create({ url: "https://kushsavvy.com/extension" });
    window.close();
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <p style={s.logo}>🌿 KushSavvy</p>
          <p style={s.tagline}>Your AI Budtender</p>
        </div>
      </div>

      <button style={s.openBtn} onClick={openSidePanel}>
        Open Insight Panel
      </button>

      {prefs?.onboardingComplete && (
        <div style={s.statsRow}>
          <div style={s.statBox}>
            <span style={s.statNum}>{remaining}</span>
            <span style={s.statLabel}>insights left today</span>
          </div>
          <div style={s.statBox}>
            <span style={s.statNum}>
              {prefs.experienceLevel === "new"
                ? "New"
                : prefs.experienceLevel.charAt(0).toUpperCase() +
                  prefs.experienceLevel.slice(1)}
            </span>
            <span style={s.statLabel}>experience</span>
          </div>
        </div>
      )}

      <button style={s.settingsLink} onClick={openSettings}>
        ⚙️ Settings & Preferences
      </button>

      <div style={s.linkRow}>
        <a
          href="https://kushsavvy.com"
          target="_blank"
          rel="noopener noreferrer"
          style={s.link}
        >
          🌐 KushSavvy.com
        </a>
        <a
          href="https://kushsavvy.com/learn/terpenes"
          target="_blank"
          rel="noopener noreferrer"
          style={s.link}
        >
          📖 Terpene Guide
        </a>
        <a
          href="https://kushsavvy.com/extension/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={s.link}
        >
          🔒 Privacy
        </a>
      </div>
    </div>
  );
}
