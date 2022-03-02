module.exports = {
  env: {
    browser: true,
    webextensions: true,
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
