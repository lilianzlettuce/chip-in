/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          400: "#84A59D"
        },
        navy: "#325374",
        emerald: "#006D77",
      },
      boxShadow: {
        "auth-card": "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
}