/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0f1e',
        panel: '#111936',
        accent: '#3dff8f',
        sky: '#38bdf8',
        coral: '#fb7185',
        lend: '#c084fc',
        borrow: '#fb923c',
      },
      borderRadius: { xl2: '1.5rem' },
    },
  },
  plugins: [],
};
