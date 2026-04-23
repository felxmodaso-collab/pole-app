import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#1e2a2e",
        "base-deep": "#16201f",
        "base-rise": "#243235",
        growth: "#a8c8a0",
        "growth-muted": "#7ea279",
        anchor: "#d4a5a5",
        "anchor-muted": "#b78585",
        cream: "#f0e6d2",
        "cream-dim": "#c9bfa8",
        // WCAG AA fixes for portfolio review:
        // - steel    raised from #6a7a88 → #8897a2 (~5:1 on base, AA small)
        // - steel-dim raised from #4a5662 → #6a7a88 (~3.3:1 on base, AA large)
        steel: "#8897a2",
        "steel-dim": "#6a7a88",
        line: "rgba(168, 200, 160, 0.28)",
      },
      fontFamily: {
        serif: ["var(--font-plex-serif)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        body: "0.005em",
        tight: "-0.015em",
      },
    },
  },
  plugins: [],
} satisfies Config;
