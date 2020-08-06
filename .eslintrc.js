const platform = process.platform === "win32" ? "windows" : "unix";

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    indent: ["error", 2, { SwitchCase: 1 }],
    "linebreak-style": ["error", platform],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-console": [
      "warn",
      { allow: ["clear", "info", "error", "dir", "trace", "log"] },
    ],
    curly: "error",
    "no-else-return": "error",
    "no-unneeded-ternary": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "one-var": ["error", "never"],
    "prefer-arrow-callback": "error",
    yoda: ["error", "never", { exceptRange: true }],
  },
};
