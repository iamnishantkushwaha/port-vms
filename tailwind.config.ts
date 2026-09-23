import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        port: {
          50: "#eef4fb",
          100: "#dbe7f5",
          200: "#b7cfea",
          300: "#8fb3dd",
          400: "#5f92cc",
          500: "#3d76b6",
          600: "#2c5d97",
          700: "#224a7a",
          800: "#193860",
          900: "#122845",
          950: "#0a1930",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        popover: "0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -4px rgb(15 23 42 / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
