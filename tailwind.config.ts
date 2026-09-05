import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#FDFBF7', 100: '#F7F3E8', 200: '#EDE4D3' },
        champagne: { 100: '#F3E5AB', 200: '#EAD7B7', 300: '#D4AF37' },
        charcoal: { 800: '#333333', 900: '#1A1A1A' },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      animation: { 'float': 'float 6s ease-in-out infinite' },
      keyframes: { float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } } }
    },
  },
  plugins: [],
};
export default config;