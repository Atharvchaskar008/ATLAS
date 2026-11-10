/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atlas: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
          dark: '#0B0F17',
          card: '#121824',
          border: '#1E293B',
          accent: '#38BDF8',
          gold: '#F59E0B'
        }
      }
    },
  },
  plugins: [],
}

