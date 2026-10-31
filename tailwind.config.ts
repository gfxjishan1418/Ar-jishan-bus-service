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
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E5C866",
          dark: "#AA8214",
          hover: "#C39E2E",
          subtle: "#F9F5EA",
          gradientStart: "#D4AF37",
          gradientEnd: "#AA7A1E",
        },
        charcoal: {
          DEFAULT: "#242424",
          light: "#333333",
          dark: "#1A1A1A",
        },
        deepBlack: "#111111",
        pureBlack: "#0A0A0A",
        luxuryGray: "#F5F5F5",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-cinzel)", "serif"],
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(212, 175, 55, 0.25)",
        "gold-lg": "0 10px 30px -4px rgba(212, 175, 55, 0.35)",
        dark: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
