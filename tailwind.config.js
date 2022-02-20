module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-spotify': '#121212',
        'dark-gray-spotify': '#18191A'
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
  ],
}
