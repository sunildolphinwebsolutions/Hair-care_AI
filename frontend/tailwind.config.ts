import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F19",
        canvas: "#F8FAF8",
        surface: "#161D2F",
        "surface-light": "#FFFFFF",
        "surface-border": "rgba(255, 255, 255, 0.08)",
        brand: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#164E33",
          600: "#154D34",
          700: "#0D3823",
        },
        gold: {
          400: "#E6CA65",
          500: "#D4AF37",
          600: "#B89228",
        },
        rose: {
          400: "#F4B2A3",
          500: "#E0A96D",
        },
        emerald: {
          400: "#34D399",
          500: "#10B981",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(212, 175, 55, 0.25)",
        "glow-green": "0 0 20px rgba(21, 77, 52, 0.25)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
