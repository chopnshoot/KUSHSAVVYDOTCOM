import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF8",
        surface: "#FFFFFF",
        "text-primary": "#1A1A1A",
        "text-secondary": "#6B6B6B",
        "text-tertiary": "#9B9B9B",
        accent: {
          green: "#2D6A4F",
          "green-light": "#40916C",
        },
        warm: "#D4A373",
        border: "#E8E8E4",
        "tag-bg": "#F0EFEB",
        "tool-bg": "#F7F7F5",
        indica: "#2D6A4F",
        sativa: "#D4A373",
        hybrid: "#7B2D8E",
      },
      fontFamily: {
        heading: ["Fraunces", "Georgia", "serif"],
        body: ["Outfit", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      lineHeight: {
        relaxed: "1.7",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
