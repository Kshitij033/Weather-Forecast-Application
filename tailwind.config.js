/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      height: {
        '18' : '4.5rem'
      },
      minWidth: {
        '49' : '12.5rem'
      },
      gap: {
        '5.5' : '22.5px'
      }
    },
  },
  plugins: [],
}