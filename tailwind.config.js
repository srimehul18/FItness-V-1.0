// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}" // optional if you use src/
  ],
  theme: {
    extend: {
      colors: {
        // keep in sync with your CSS vars if you want
        primary: "#3b82f6",
        accent: "#8b5cf6",
      }
    },
  },
  plugins: [],
};
