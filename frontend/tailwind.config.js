/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paytm: {
          blue: '#00BAF2',
          dark: '#002E6E',
          cyan: '#00E5FF',
          deep: '#001845',
          glow: 'rgba(0, 186, 242, 0.4)'
        },
        navy: {
          950: '#040711',
          900: '#080E21',
          850: '#0D1733',
          800: '#132147',
          700: '#1C2E60'
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 229, 255, 0.3)',
        'glow-blue': '0 0 30px -5px rgba(0, 186, 242, 0.35)',
        'glow-purple': '0 0 30px -5px rgba(168, 85, 247, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
