/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
      colors: {},
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          from: {
            opacity: "0%",
          },
          to: {
            opacity: "100%",
          },
        },
        "top-to-bottom": {
          from: {
            opacity: "0%",
            transform: "translateY(-50px)",
          },

          to: {
            opacity: "100%",
            transform: "translateY(0px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.3s ease-in-out forwards",
        "fade-in": "fade-in 0.2s ease-out",
		    "top-to-bottom": "top-to-bottom 0.3s ease-out"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
