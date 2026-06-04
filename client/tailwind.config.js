/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sage: { 400: '#4A9B7F', 500: '#3A8A6E', 900: '#1C2B2B' },
        warm: { 50: '#F7F5F0' },
      },
      fontFamily: {
        display: ['Lora', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
