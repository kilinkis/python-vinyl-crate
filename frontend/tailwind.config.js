/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#f7f4ec',
          50: '#faf8f4',
          100: '#f7f4ec',
          200: '#ede6d5',
          300: '#e0d4b8',
          400: '#cfbc94',
          500: '#be9f6e',
        },
        brass: {
          DEFAULT: '#d4af37',
          light: '#e6c86e',
          dark: '#9a7b1c',
        },
        wood: {
          DEFAULT: '#2a1a12',
          light: '#3d261b',
          dark: '#170e0a',
          edge: '#5c3a29',
        },
        vinyl: {
          dark: '#0d0f12',
          surface: '#15181e',
          card: '#1c2028',
          border: '#272d38',
          groove: '#2d3340',
          accent: '#f59e0b',
        }
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
  plugins: [],
};
