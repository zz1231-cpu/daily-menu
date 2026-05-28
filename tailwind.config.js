/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fff9fb',
        blush: '#fff0f5',
        peach: '#ffd4e2',
        honey: '#f3f0f2',
        cocoa: '#232124',
        berry: '#f48caf',
      },
      boxShadow: {
        soft: '0 14px 38px rgba(35, 33, 36, 0.1)',
        candy: '0 18px 45px rgba(244, 140, 175, 0.16)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
