/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        visited: '#3b82f6',
        'visited-hover': '#2563eb',
      },
    },
  },
  plugins: [],
};
