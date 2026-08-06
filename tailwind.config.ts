import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hazy: {
          bg: "#07090e",
          card: "rgba(15, 23, 42, 0.65)",
          border: "rgba(255, 255, 255, 0.08)",
          accent: "#8cff2e",
          text: "#f3f4f6",
          muted: "#94a3b8",
          dim: "#4b5563",
        },
        accent: {
          yt: "#84cc16",
          dti: "#eab308",
          polycon: "#3b82f6",
          idee: "#8cff2e",
          sentinel: "#06b6d4",
          spellgate: "#8b5cf6",
        }
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-syne)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      transitionTimingFunction: {
        "ease-out-custom": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-out-custom": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
