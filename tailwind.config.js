/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6"
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.1), 0 4px 30px rgba(80,0,200,0.35)"
      },
      dropShadow: {
        brand: "0 0 18px rgba(124,58,237,0.55)"
      }
    },
  },
  plugins: [],
}
