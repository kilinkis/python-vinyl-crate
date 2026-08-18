/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
