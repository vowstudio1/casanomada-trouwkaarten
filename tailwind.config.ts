import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fdf6f7",
          100: "#f9eced",
          200: "#f0d0d3",
          300: "#e4adb2",
          400: "#d4808a",
          500: "#bf5866",
          600: "#a03d4c",
          700: "#7a2d39",
          800: "#59262F",
          900: "#3e1b21",
          950: "#220f12",
        },
        cream: "#FAFAF8",
        text: {
          DEFAULT: "#16161D",
          muted: "#6b6b7a",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans:  ["var(--font-roboto)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.25em",
      },
    },
  },
  plugins: [],
};

export default config;
