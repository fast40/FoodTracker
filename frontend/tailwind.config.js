import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#131313",
        
        content1: "#1b1b1b",
        content2: "#232323",
        content3: "#2b2b2b",
        content4: "#333333",

        primary: {
          DEFAULT: "#9692deff",
          foreground: "#000000",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}