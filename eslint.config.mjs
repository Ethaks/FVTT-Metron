// SPDX-FileCopyrightText: 2024 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import globals from "globals";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import("eslint").ESLint.ConfigData} */
export default [
	js.configs.recommended,
	eslintConfigPrettier,
	{
		ignores: ["**/dist", "coverage/"],
	},
	{
		plugins: {},

		languageOptions: {
			globals: {
				...globals.browser,
				game: "readonly",
				Hooks: "readonly",
				CONFIG: "readonly",
				foundry: "readonly",
				Application: "readonly",
				Actor: "readonly",
				Item: "readonly",
			},

			ecmaVersion: 2022,
			sourceType: "module",

			parserOptions: {
				extraFileExtensions: [".cjs", ".mjs"],
			},
		},

		rules: {
			"no-unused-vars": [
				"error",
				{
					args: "none",
					argsIgnorePattern: "^_",
				},
			],
		},
	},

	{
		files: ["./*.js", "./*.cjs", "./*.mjs", "./tools/*.mjs", "./tools/*.cjs"],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},

	{
		files: ["**/*.cjs"],
		languageOptions: { sourceType: "commonjs" },
	},
];
