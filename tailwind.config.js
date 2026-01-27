/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Institutional Dark Theme
        'ink': {
          DEFAULT: '#0A0A0B',
          light: '#161618',
          medium: '#1C1C1E',
          border: '#2C2C2E',
          card: '#1F2937', // Dark gray for tool cards
        },
        // Accent Colors - Bright Teal Theme
        'accent': {
          DEFAULT: '#01F9C6', // Bright Teal
          hover: '#00D9AB',
          light: '#33FACD',
          green: '#01F9C6', // Use bright teal for success states
        },
        // Legacy brand colors (kept for compatibility)
        'brand-teal': '#01F9C6',
        'brand-teal-dark': '#00D9AB',
        'brand-teal-light': '#33FACD',
        // Neutral palette
        'neutral-50': '#FAFAFA',
        'neutral-100': '#F5F5F5',
        'neutral-200': '#E5E5E5',
        'neutral-300': '#D4D4D4',
        'neutral-400': '#A3A3A3',
        'neutral-500': '#737373',
        'neutral-600': '#525252',
        'neutral-700': '#404040',
        'neutral-800': '#262626',
        'neutral-900': '#171717',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        // Institutional Typography Scale
        'h1': ['64px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h2': ['48px', { lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.01em' }],
        'h3': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'h4': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'label': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'button': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        'caption': ['12px', { lineHeight: '1.5', fontWeight: '500', letterSpacing: '0.05em' }],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 20px rgba(1, 249, 198, 0.4)',
        'glow-teal': '0 0 30px rgba(1, 249, 198, 0.5)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        'pulse-dot': 'pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        marquee: 'marquee 30s linear infinite',
        slideInRight: 'slideInRight 0.3s ease-out',
        slideInLeft: 'slideInLeft 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
