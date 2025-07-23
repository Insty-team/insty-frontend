import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
	{
		plugins: {
			prettier: eslintPluginPrettier,
			"simple-import-sort": eslintPluginSimpleImportSort,
		},
		rules: {
			"prettier/prettier": ["warn", { useTabs: true, endOfLine: "auto" }],
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"import/order": "off",
			"@typescript-eslint/no-unused-vars": ["error"],
			"@typescript-eslint/no-unused-expressions": "off",
			"no-useless-concat": "warn",
			"prefer-template": "warn",
			"no-unused-expressions": ["error", { allowTernary: true }],
		},
	},
];

export default eslintConfig;
