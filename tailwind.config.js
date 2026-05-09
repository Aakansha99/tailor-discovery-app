/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a1a1a',
          light: '#444',
          muted: '#777',
          faint: '#aaa',
        },
        // Deeper Royal Lavender — single accent across the app
        brand: {
          DEFAULT: '#4A2D8F', // primary CTA, links, role names
          dark: '#3F2A75',    // pressed/hover, bold text
          mid: '#C0AFDC',     // illustration circles, badges
          light: '#E8E1F2',   // card backgrounds
        },
        line: '#e8e8e8',
        bg: {
          DEFAULT: '#ffffff',
          subtle: '#f7f7f5',
          muted: '#f0f0ec',
        },
      },
    },
  },
  plugins: [],
};
