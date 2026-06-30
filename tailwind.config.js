/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#d1fae5',
        },
        danger: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
        warning: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        success: {
          DEFAULT: '#22c55e',
        },
      },
      fontSize: {
        'elder-body':    ['20px', { lineHeight: '28px' }],
        'elder-heading': ['30px', { lineHeight: '36px' }],
      },
      minHeight: {
        touch: '56px',
        sos:   '64px',
      },
      minWidth: {
        touch: '56px',
        sos:   '64px',
      },
    },
  },
  plugins: [],
};
