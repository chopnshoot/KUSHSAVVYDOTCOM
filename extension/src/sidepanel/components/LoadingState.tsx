import React from "react";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 16,
    padding: 24,
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #e5e5e5",
    borderTopColor: "#2D6A4F",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  message: {
    fontSize: 14,
    color: "#555",
    textAlign: "center" as const,
    margin: 0,
  },
  skeleton: {
    width: "100%",
    height: 16,
    background: "linear-gradient(90deg, #f0f0ec 25%, #e8e8e4 50%, #f0f0ec 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: 4,
    marginBottom: 8,
  },
};

// Inject keyframes once
const styleEl = document.createElement("style");
styleEl.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
`;
document.head.appendChild(styleEl);

export function LoadingState({ message }: { message: string }) {
  return (
    <div style={styles.container}>
      <div style={styles.spinner} />
      <p style={styles.message}>{message}</p>
      <div style={{ width: "100%", maxWidth: 240 }}>
        {[90, 70, 85, 60, 75].map((w, i) => (
          <div key={i} style={{ ...styles.skeleton, width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
