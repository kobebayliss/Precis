/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Inter"', 'sans-serif'],
        geist: ['"Geist"', 'sans-serif'],
      },
      keyframes: {
        animateStarKeyframe: {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(-4000px)" },
        },
      },
      animation: {
        "animateStar": "animateStarKeyframe 50s linear infinite",
      },
    },
  },
  plugins: [],
}