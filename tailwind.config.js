/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'momentum': {
          'bg': '#0F1419',
          'dark': '#001D39',
          'primary': '#0A4174',
          'secondary': '#49769F',
          'accent': '#4E8EA2',
          'light-1': '#6EA2B3',
          'light-2': '#7BBDE8',
          'light-3': '#BDD8E9',
        }
      },
    },
  },
  plugins: [],
}