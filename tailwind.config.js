/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // softened from The Roots' own logo tile (a plum-to-umber gradient) on oat paper
        oat: '#efe8df',
        linen: '#f3ede6',
        sand: '#e7ddd0',
        mist: '#e8e2e6',
        ink: '#2d2330',
        plum: '#5e4467',
        clay: '#a8674a',
        moss: '#6c7458',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
