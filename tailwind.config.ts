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
        slate: {
          50: "#f7f8fa",
          100: "#eef0f4",
          200: "#dce0e8",
          400: "#8b95a8",
          600: "#4b5563",
          800: "#1e2533",
          900: "#0d1117",
        },
        indigo: {
          400: "#6b8aff",
          500: "#4f6ef7",
          600: "#3d5bd9",
          700: "#2f4bbf",
        },
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
        },
        coral: {
          400: "#fb8a9c",
          500: "#fb7185",
          600: "#e05a6e",
        },
        amber: {
          400: "#fcd34d",
          500: "#fbbf24",
          600: "#f59e0b",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
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
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(13, 17, 23, 0.06), 0 1px 3px rgba(13, 17, 23, 0.04)",
        "card-hover": "0 4px 12px rgba(13, 17, 23, 0.08), 0 2px 4px rgba(13, 17, 23, 0.04)",
        "card-dark": "0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)",
        "card-dark-hover": "0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)",
        glass: "0 4px 24px rgba(13, 17, 23, 0.08)",
        "glass-lg": "0 8px 40px rgba(13, 17, 23, 0.12)",
        indigo: "0 2px 8px rgba(79, 110, 247, 0.25)",
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