/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6F73D2',
        officeGreen: '#157F1F',
        imperialRed: '#FF4242',
        ultraPink: '#FB62F6',
        charcoal: '#2E4057',
        coffee: '#4C2E05',
      },
    },
  },
  plugins: [],
};
