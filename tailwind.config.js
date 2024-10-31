// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}' // Specify the paths to your React components
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'] // Adding Poppins as the default sans font
      },
      colors: {
        customGreen: '#38C68B',
        customGreenDefault: '#6fe0b5'
      }
    }
  },
  plugins: []
};
