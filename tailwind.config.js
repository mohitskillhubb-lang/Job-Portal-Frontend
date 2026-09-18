/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f5fe',
          100: '#e3ecfd',
          200: '#c2d8fa',
          300: '#8db9f6',
          400: '#5297f0',
          500: '#2a78ea',
          600: 'rgb(66, 134, 244)',
          700: '#154fb5',
          800: '#164393',
          900: '#173a74',
          950: '#102546',
        },
      },
    },
  },
  plugins: [],
}
