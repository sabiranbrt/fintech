/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scrollbar: ["rounded"],
      colors: {
        primary: {
          DEFAULT: "#4a5daa",
          light: "#7584bf",
          dark: "#253571",
        },
        secondary: {
          DEFAULT: "#33a6a8",
          dark: "#1e6465",
          light: "#3bc1c3",
          "extra-dark": "#1a5658",
          background: "#f5f5f5",
        },
      },
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
        Jost: ["Jost", "sans-serif"],
      },
      backgroundImage: {
        "custom-image": "url('src/assets/images/bg-1.png')",
        "gradient-to-right": "linear-gradient(to right, #4b5a9f, #4fb5b7)",
      },
      keyframes: {
        "fade-in-out": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "fade-in-out": "fade-in-out 2s infinite",
      },
      // borderImage: {
      //   "custom-gradient": "linear-gradient(45deg, #4b5a9f, #4fb5b7)",
      // },
    },
  },
  plugins: [],
};
