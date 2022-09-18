// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
    extraFileExtensions: [".cjs", ".mjs"],
    sourceType: "module",
  },

  env: {
    browser: true,
    es2022: true,
  },

  extends: [
    "eslint:recommended",
    "@typhonjs-fvtt/eslint-config-foundry.js/0.8.0",
    "plugin:prettier/recommended",
  ],

  plugins: [],

  rules: {
    "no-unused-vars": ["error", { args: "none", argsIgnorePattern: "^_" }],
  },

  overrides: [
    {
      files: ["./*.js", "./*.cjs", "./*.mjs", "./tools/*.mjs", "./tools/*.cjs"],
      env: {
        node: true,
      },
    },
  ],
};
