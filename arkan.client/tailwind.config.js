/* eslint-disable quotes */
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx,svg}'],
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.word-break': {
          wordBreak: 'break-word'
        },
        '.text-shadow-50': {
          textShadow: '0 0 0.5px'
        },
        '.dir-ltr': {
          direction: 'ltr'
        },
        '.dir-rtl': {
          direction: 'rtl'
        }
      });
    }),
    require('tailwindcss-animated')
  ],
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  theme: {
    extend: {
      backgroundImage: {
        'stats-bg': "url('/src/assets/images/stats.png')",
        'user-cover': "url('/src/assets/images/user-cover.png')",
        'quiz-cover': "url('/src/assets/images/quiz-cover.svg')"
      },
      colors: {
        'backdrop-grey': 'rgba(152, 164, 184, 0.3)',
        'gradient-white-06': 'rgba(255, 255, 255, 0.6)',
        'gradient-white-01': 'rgba(255, 255, 255, 0.1)',
        'light-grey': '#d7def0',
        'error-50': '#FFD8DC',
        'error-100': '#E52D42',
        'error-200': '#C32638',
        'error-300': '#971625',
        'body-text-color': '#555555',
        'brand-dark': '#09BBB8',
        'brand-active-100': '#008e8c',
        'brand-200': '#00CDCA',
        'blue-grey-25': '#EAECF0',
        'blue-grey-50': '#F8F9FF',
        'blue-grey-100': '#edf1fd',
        'blue-grey-200': '#f9fafd',
        'blue-grey-300': '#d2dae7',
        'blue-grey-400': '#909FBA',
        'blue-grey-500': '#62769d',
        'blue-grey-600': '#3E537C',
        'blue-grey-900': '#252E4A',
        'light-pink': '#FFF4F4',
        'base-white': '#FFFFFF',
        'aiding-300': '#FDAC42',
        'input-ring-active-100': '#99f6e4',
        'white-rgba-16': 'rgba(255, 255, 255, 0.16)',
        'alert-info': '#fcc53a',
        'alert-success': '#00bc7d',
        'base-dark-gray': '#757575',
        'base-dark-gray-100': '#3C3C3C',
        'scroll-bar': 'rgba(144, 159, 186, 0.4)',
        'table-highlight': 'rgba(9, 187, 184, 0.15)',
        'highlighted-field': '#FFA629',
        primary: '#f59e0b',
        arkan: '#925917',
        'arkan-dark': '#874900'
      },
      borderRadius: {
        xl: '0.6rem',
        '1xl': '0.75rem',
        '2xl': '0.9375rem',
        '2.5xl': '1rem',
        base: '1.25rem',
        '3xl': '1.5625rem',
        '3.5xl': '1.875rem',
        '4xl': '2.1875rem'
      },
      zIndex: {
        max: '1050'
      },
      screens: {
        mobile: { min: '320px', max: '1024px' },
        xs: { min: '320px', max: '390px' }
      },
      maxWidth: {
        11: '11px',
        12: '12px',
        14: '14px',
        20: '20px',
        1200: '75rem',
        '1/2': '50%'
      },
      minWidth: {
        11: '11px',
        16: '1rem',
        12: '12px',
        14: '14px',
        20: '20px',
        32: '32px'
      },
      minHeight: {
        14: '14px'
      },
      height: {
        '12-px': '12px',
        btn: '40px'
      },
      padding: {
        base: '10px',
        '1/2': '0.5px'
      },
      keyframes: {
        'blink-caret': {
          to: { 'border-color': 'white' },
          '50%': { 'border-color': 'black' }
        }
      },
      dropShadow: {
        regular: 'drop-shadow(0px 0px 5px rgba(136, 165, 191, 0.2))'
      }
    },
    fontSize: {
      '11-px': '11px',
      xs: '11px',
      sm: '.75rem',
      md: '0.875rem',
      base: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '1.75rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem'
    }
  }
};
