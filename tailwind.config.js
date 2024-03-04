/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        OpenSans: [
          "OpenSans"
        ],
        Oswald: [
          "Oswald"
        ],
    },
    },
  },
  corePlugins: {
    fontWeight: false
  },
  plugins: [
    require("./fontVariationSettingsPlugin"),
    require('flowbite/plugin')
  ],
}

