/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pawnie: {
          50: "#f6f8ff",
          100: "#eef1fe",
          200: "#dbe0fd",
          300: "#c2c9fb",
          400: "#9ca7f7",
          500: "#6a7af2",
          600: "#4d5aeb",
          700: "#3e47d6",
          800: "#343ab0",
          900: "#2e348f"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      }
    }
  },
  plugins: []
};
