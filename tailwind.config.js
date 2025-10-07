/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "*.html",
    "./node_modules/flowbite/**/*.js"
  ],

  theme: {
    extend: {
      fontFamily: {
        whisper: ["Whisper", "serif"],
        baskerville: ["Libre-Baskerville", "serif"],
        antic: ["Antic Didone", "serif"],
        geologica: ["Geologica", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        openSans: ["Open Sans", "sans-serif"]
      },
      colors: {
        "cafe": "#6F4C3E",
        "fondoCrema": "#E3D7BB",
        "fondoVerde": "#2D5132",
        "fondoTextos":"#ECE7D5"
      },
      transitionDuration: {
        '5000': '5000ms',
        '1000':'1000ms' // Agrega esta línea
      },
      fontSize: {
        'xs': '0.75rem',   // 12px
        'sm': '0.875rem',  // 14px
        'tiny': '0.875rem', // 14px (puedes usarlo como un alias)
        'base': '1rem',    // 16px
        'lg': '1.125rem',  // 18px
        'xl': '1.25rem',   // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '4rem',     // 64px
        '7xl': '5rem',     // 80px
        '8xl': '6rem',     // 96px
        '9xl': '8rem',
        '10xl': '10rem',   // 160px
        '11xl': '12rem',
      },
      height: {
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '3/4': '75%',
        '9/10': '90%',
        'full': '100%',
      },
      opacity: {
        '0': '0',
        '5': '0.05',
        '10': '0.1',
        '20': '0.2',
        '25': '0.25',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '75': '0.75',
        '80': '0.8',
        '90': '0.9',
        '100': '1',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}

