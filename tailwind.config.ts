import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#000000",
        ink: "#0a0a0a",
        carbon: "#100a08",
        hazard: "#8B0000",
        volt: "#CC0000",
        tar: "#1a1a1a",
        chrome: {
          50: "#F5ECD7",
          100: "#E8D9B0",
          200: "#D4C6A5",
          300: "#B0A89A",
          400: "#7D746A",
          500: "#5A4A42",
        },
        warning: {
          50: "#FFF4DD",
          100: "#F5ECD7",
          200: "#E8D9B0",
          300: "#CC0000",
          400: "#8B0000",
          500: "#6B0000",
        },
        petrol: {
          50: "#D8E8D1",
          100: "#9DB58C",
          200: "#4A7A4A",
          300: "#345C34",
          400: "#203D20",
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"]
      },
      boxShadow: {
        gauge: "0 0 0 1px rgba(139,0,0,0.32), 0 18px 60px rgba(0,0,0,0.48)",
        warning: "0 0 0 1px rgba(139,0,0,0.38), 0 16px 42px rgba(120,0,0,0.2)"
      }
    }
  },
  plugins: []
};

export default config;
