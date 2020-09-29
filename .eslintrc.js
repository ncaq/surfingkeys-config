module.exports = {
  env: {
    browser: true,
    webextensions: true,
  },
  extends: ["airbnb-base", "prettier"],
  plugins: ["mysticatea"],
  rules: {
    "mysticatea/no-instanceof-array": "error",
    "mysticatea/no-instanceof-wrapper": "error",
    "mysticatea/no-literal-call": "error",
    "mysticatea/no-this-in-static": "error",
    "mysticatea/no-use-ignored-vars": "error",
    "mysticatea/no-useless-rest-spread": "error",
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
