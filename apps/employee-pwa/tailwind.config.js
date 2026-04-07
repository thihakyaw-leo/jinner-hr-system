/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Segoe UI', 'sans-serif']
      },
      colors: {
        accent: {
          100: '#e0f2fe',
          300: '#7dd3fc',
          700: '#0369a1'
        }
      }
    }
  }
};
