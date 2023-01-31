module.exports = {
  env: {
    es2022: true,
    browser: true,
    webextensions: true,
  },
  parserOptions: {
    ecmaVersion: 13,
  },
  extends: ["airbnb-base", "prettier"],
  rules: {
    curly: ["error", "all"],
    "prefer-destructuring": [
      "error",
      {
        array: false,
        object: true,
      },
    ],
  },
};
