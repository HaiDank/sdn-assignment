/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,ejs}",
  "./views/*.{html,ejs}",
  "./views/**/*.{html,ejs}",

],
mode: "jit",
  theme: {
    extend: {},
  },
  plugins: [],
}