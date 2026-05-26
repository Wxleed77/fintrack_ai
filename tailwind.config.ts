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
        emerald: {
          50: "#E1F5EE", 100: "#9FE1CB", 200: "#5DCAA5",
          400: "#1D9E75", 600: "#0F6E56", 700: "#0A5A47",
          800: "#085041", 900: "#04342C", 950: "#022218",
        },
      },
      borderRadius: { xl: "12px", "2xl": "16px" },
    },
  },
  plugins: [],
};

export default config;
