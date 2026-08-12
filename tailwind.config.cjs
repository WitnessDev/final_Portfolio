module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        ui: ['Manrope', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
