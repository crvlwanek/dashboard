import type { Config } from "tailwindcss"

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
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
