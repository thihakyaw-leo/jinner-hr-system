/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Segoe UI', 'sans-serif']
      },
      colors: {
        brand: {
          300: '#7dd3fc',
          500: '#38bdf8',
          700: '#0f766e'
        }
      },
      boxShadow: {
        glow: '0 24px 80px rgba(56, 189, 248, 0.16)'
      }
    }
  }
};
