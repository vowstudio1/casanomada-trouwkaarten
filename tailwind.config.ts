import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf8f8",
          100: "#f2ecec",
          200: "#e6d8d9",
          300: "#d1b5b8",
          400: "#b88a8f",
          500: "#9e6670",
          600: "#834a55",
          700: "#6e3a44",
          800: "#59262f",
          900: "#4a1f28",
          950: "#2d1018",
        },
        cream: "#fafaf8",
        dark: "#16161d",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "'Playfair Display'", "Georgia", "serif"],
        sans: ["'Roboto'", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
