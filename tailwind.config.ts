import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ledger: {
          50: "#f4f6f9",
          100: "#e8ecf2",
          200: "#d0d7e3",
          400: "#7c8ca6",
          600: "#2a384b",
          900: "#0b111e",
        },
        emerald: {
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        rose: {
          500: "#f43f5e",
        },
        amber: {
          500: "#f59e0b",
        },
        blue: {
          500: "#3b82f6",
        },
        violet: {
          500: "#8b5cf6",
        },
      },
      fontFamily: {
        display: ["var(--font-body)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(11, 17, 30, 0.06), 0 1px 2px rgba(11, 17, 30, 0.04)",
        "card-hover": "0 4px 12px rgba(11, 17, 30, 0.08), 0 2px 4px rgba(11, 17, 30, 0.04)",
        "card-dark": "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
        "card-dark-hover": "0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)",
        glass: "0 4px 24px rgba(11, 17, 30, 0.08)",
        "glass-lg": "0 8px 40px rgba(11, 17, 30, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.3s ease-out forwards",
        "slide-down": "slideDown 0.2s ease-out forwards",
        "scale-in": "scaleIn 0.15s ease-out forwards",
        shimmer: "shimmer 1.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;