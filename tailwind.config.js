/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5fc',
          100: '#e1ecf8',
          200: '#c3daf1',
          300: '#95bee7',
          400: '#619dd9',
          500: '#3c7ec9',
          600: '#2a63ab',
          700: '#23508c',
          800: '#1e4474',
          900: '#142D4E', // Brand Deep Navy
          950: '#0c1b30',
        },
        secondary: {
          50: '#edfbf6',
          100: '#d5f6e9',
          200: '#aeecd6',
          300: '#79dcbd',
          400: '#40c49e',
          500: '#159A75', // Brand Emerald
          600: '#128666',
          700: '#116b54',
          800: '#115544',
          900: '#104639',
          950: '#052720',
        }
      },
      fontSize: {
        'accessible-sm': ['1rem', { lineHeight: '1.5rem' }],
        'accessible-base': ['1.125rem', { lineHeight: '1.75rem' }],
        'accessible-lg': ['1.25rem', { lineHeight: '1.875rem' }],
        'accessible-xl': ['1.5rem', { lineHeight: '2rem' }],
        'accessible-2xl': ['1.875rem', { lineHeight: '2.25rem' }],
      }
    },
  },
  plugins: [],
}
