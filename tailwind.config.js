/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. THIS IS THE KEY: Enable manual dark mode toggling
  darkMode: 'class', 
  
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // STI Brand Colors
        'sti': {
          'blue': '#0066B3',      // STI Primary Blue
          'dark-blue': '#004A8D', // STI Dark Blue
          'light-blue': '#E6F2FF', // Light Blue
          'gold': '#FFD700',      // Accent Gold
          'dark-gold': '#B8860B', // Dark Gold
        },
        primary: {
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CCFF',
          300: '#66B2FF',
          400: '#3399FF',
          500: '#0066B3', // STI Blue
          600: '#005299',
          700: '#004080',
          800: '#002D66',
          900: '#001A33',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 102, 179, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 102, 179, 0.12)',
      },
      // 2. Add smooth transitions for theme switching
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke, box-shadow, opacity',
      }
    },
  },
  plugins: [],
}