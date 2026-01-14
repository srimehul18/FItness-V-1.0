
module.exports = {
  // ...existing config...
  safelist: [
    "from-blue-400",
    "to-blue-600",
    "from-yellow-400",
    "to-orange-400",
    "from-indigo-500",
    "to-purple-500",
    "from-pink-400",
    "to-rose-500",
    "from-emerald-400",
    "to-green-600",
  ],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}" 
  ],
  theme: {
    extend: {
      colors: {
        
        primary: "#3b82f6",
        accent: "#f97316",
        background: "#f3f4f6",
        foreground: "#111827",
      },
    },
  },
  plugins: [],
};
