/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
        cursive: ["Dancing Script", "cursive"],
      },
      colors: {
        sage: {
          50: "#fdf2f8", // pink-50
          100: "#fce7f3", // pink-100
          200: "#fbcfe8", // pink-200
          300: "#f9a8d4", // pink-300
          400: "#f472b6", // pink-400
          500: "#ec4899", // pink-500 (Primary)
          600: "#db2777", // pink-600
          700: "#be185d", // pink-700
          800: "#9d174d", // pink-800
          900: "#831843", // pink-900
        },
        cream: {
          50: "#fff1f2", // rose-50 (warmer cream alternative for pink)
          100: "#ffe4e6", // rose-100
          200: "#fecdd3", // rose-200
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
