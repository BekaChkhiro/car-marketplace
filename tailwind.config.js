/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#009C6D',
        secondary: '#00B67F',
        background: '#F8F9FA',
        'text-dark': '#333333',
        'text-light': '#FFFFFF',
        'gray-dark': '#212529',
        'gray-light': '#F0F0F0',
        'green-light': '#E8F5E9',
        'green-lighter': '#C8E6C9',
        success: '#45A049',
        error: '#F44336',
        warning: '#FFEB3B',
        info: '#2E7D32',
        accent: '#C8E6C9',
        border: '#E8F5E9',
        'card-bg': '#FFFFFF'
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'modal-enter': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slowly-move': {
          '0%': { transform: 'scale(1.05) translate(0, 0)' },
          '50%': { transform: 'scale(1.05) translate(-1%, -1%)' },
          '100%': { transform: 'scale(1.05) translate(0, 0)' }
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        'modal-enter': 'modal-enter 0.2s ease-out',
        'slowly-move': 'slowly-move 20s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'bounce-in': 'bounce-in 0.2s ease-out'
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.25rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        'hero': '3rem'
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        'section': '6rem'
      },
      screens: {
        'mobile': '320px',
        'tablet': '768px',
        'desktop': '1024px',
        'large-desktop': '1440px'
      },
      fontFamily: {
        primary: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif']
      },
      lineHeight: {
        'tight': '1.25',
        'normal': '1.5',
        'relaxed': '1.75'
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700'
      },
      transitionProperty: {
        'default': 'all',
      },
      transitionDuration: {
        'default': '300ms',
        'fast': '150ms',
        'slow': '450ms'
      },
      transitionTimingFunction: {
        'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
}