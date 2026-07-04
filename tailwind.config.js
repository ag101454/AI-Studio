/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          heading: ['Plus Jakarta Sans', 'sans-serif'],
        },
        colors: {
          turmeric: {
            50: '#fef9e7',
            100: '#fdf0c3',
            200: '#fbe48f',
            300: '#f0c75e',
            400: '#e6a817',
            500: '#c8870a',
            600: '#9e6b08',
            700: '#7d5206',
            800: '#5c3c04',
            900: '#3d2e14',
          },
          malt: {
            50: '#fdfaf2',
            100: '#faf6ed',
            200: '#f5ecd7',
            300: '#e8d9b0',
            400: '#d4c9a8',
            500: '#b8a87e',
            600: '#9c8c62',
            700: '#7d6e46',
            800: '#5e502a',
            900: '#3d2e14',
          },
          honey: {
            50: '#fefce8',
            100: '#fdf6c3',
            200: '#fcec8a',
            300: '#f0c75e',
            400: '#e6a817',
            500: '#c8870a',
            600: '#9e6b08',
            700: '#7d5206',
          },
        },
      },
    },
    plugins: [],
  }