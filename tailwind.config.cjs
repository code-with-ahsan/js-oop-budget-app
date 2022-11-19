/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./main.js"],
  theme: {
    extend: {
      colors: {
        "light-gray": "#F1F2F8",
        "lighter-gray": "#F9FAFC",
      },
    },
  },
  plugins: [],
};
