/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "scroll-wheel": "scroll-wheel 2s infinite",
        "scroll-dot": "scroll-dot 2s infinite",
      },
      keyframes: {
        "scroll-wheel": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        "scroll-dot": {
          "0%": {
            transform: "translateY(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(10px)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};

