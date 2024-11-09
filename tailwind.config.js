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
      minHeight: {
        '90vh' : '73.5vh'
      },
      gap: {
        '4.5' : '18.5px',
        '5.5' : '22.5px'
      }
    },
  },
  plugins: [],
}