module.exports = {
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "'Fira Code'",
          "Menlo",
          "Monaco",
          "Consolas",
          "'Liberation Mono'",
          "'Courier New'",
          "monospace"
        ]
      }
    }
  },
  variants: {},
  future: {
    removeDeprecatedGapUtilities: true
  },
  plugins: [require("@tailwindcss/ui")]
};
