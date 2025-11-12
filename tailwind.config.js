/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00F0FF',
        'neon-pink': '#FF006E',
        'neon-purple': '#D092FF',
        'electric-blue': '#0081C6',
        'lt-blue': '#81DDF9',
        'navy': '#1A1A2E',
        'deep-black': '#0A0A0A',
        'light-grey': '#B3B3B3',
      },
    },
  },
  plugins: [],
}
