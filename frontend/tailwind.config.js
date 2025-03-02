/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          urbanist: ["var(--font-urbanist)"],
        },
        colors: {
          primary: {
            DEFAULT: "#6E38E0",
            light: "#8A5CF5",
            dark: "#5A2CB8",
          },
          secondary: {
            DEFAULT: "#FF5F36",
            light: "#FF8F6A",
            dark: "#E04D28",
          },
          dark: {
            DEFAULT: "#151515",
            lighter: "#1A1A1A",
            light: "#222222",
          },
        },
        gradientColorStops: {
          'gradient-1-start': '#6E38E0',
          'gradient-1-end': '#FF5F36',
          'gradient-2-start': '#FF5F36',
          'gradient-2-end': '#FF8F36',
          'gradient-3-start': '#FFD928',
          'gradient-3-end': '#FFA928',
          'gradient-4-start': '#00B85E',
          'gradient-4-end': '#00D88A',
        },
      },
    },
    plugins: [],
  }