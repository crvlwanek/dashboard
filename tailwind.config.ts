import type { Config } from "tailwindcss"

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      keyframes: {
        "grow-from-tr": {
          "0%": { opacity: "0", transform: "scale(0)", transformOrigin: "top right" },
          "100%": { opacity: "1", transform: "scale(1)", transformOrigin: "top right" },
        },
      },
      animation: {
        "grow-from-tr": "grow-from-tr 0.6s ease-out forwards",
      },
      colors: {
        primary: {
          main: "#00ccc5",
          light: "#40fffa",
        },
      },
    },
  },
  plugins: [],
} satisfies Config
