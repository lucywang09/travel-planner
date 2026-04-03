/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':      '0 2px 24px rgba(0,0,0,0.45)',
        'glow-sm':   '0 0 16px rgba(245,158,11,0.2)',
        'glow-md':   '0 0 28px rgba(245,158,11,0.3)',
        'glow-btn':  '0 0 0 1px rgba(245,158,11,0.25), 0 4px 16px rgba(245,158,11,0.2)',
        'glow-btn-hover': '0 0 0 1px rgba(245,158,11,0.45), 0 4px 22px rgba(245,158,11,0.35)',
      },
      animation: {
        'fade-in':  'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
