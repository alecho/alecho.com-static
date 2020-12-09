module.exports = {
  darkMode: "media",
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
      },
      colors: {
        "navy": "#1F2B43",
        "copper": "#b38761",
        "cream": "#f7f5f1",
        "old-navy": "#122327",
        "tangerine": "#f07733",
        "baseball": "#edece3",
        "theme": {
          "light": "#f7f5f1",
          "DEFAULT": "#b38761",
          "dark": "#1f2b43",
        }
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ["group-focus", "active"],
      borderColor: ["group-focus"],
      boxShadow: ["group-focus"],
      opacity: ["group-focus"],
      textColor: ["group-focus", "active"],
      textDecoration: ["group-focus"],
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ]
};
