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
          50: "#fdf8f6",
          100: "#f9ede7",
          200: "#f0d5c9",
          300: "#e4b5a0",
          400: "#d4896e",
          500: "#c06a4a",
          600: "#a85535",
          700: "#8c4429",
          800: "#6b3320",
          900: "#4a2316",
          950: "#2d1209",
        },
        wine: {
          50: "#fdf2f4",
          100: "#fce7eb",
          200: "#f9d0d9",
          300: "#f4aabb",
          400: "#ec7a97",
          500: "#df5076",
          600: "#cc305e",
          700: "#ab234d",
          800: "#8f2044",
          900: "#5c1530",
          950: "#3b0a1a",
        },
        cream: "#faf7f2",
        ivory: "#fffef9",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
