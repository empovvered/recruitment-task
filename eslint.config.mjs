import stylistic from "@stylistic/eslint-plugin"
import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier"
import prettierPlugin from "eslint-plugin-prettier"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import testingLibrary from "eslint-plugin-testing-library"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "**/scripts/**",
    "node_modules/**",
    "**/*.config.{js,ts,mjs}",
    "**/coverage/**",
    "**/public/**",
    "**/.git/**",
    "**/.husky/**",
  ]),
  {
    plugins: {
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSort,
      "testing-library": testingLibrary,
    },
    rules: {
      // General
      "no-extra-boolean-cast": "off",
      "no-console": "warn",
      "prettier/prettier": "error",

      // Imports
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",

      // Next.js
      "@next/next/no-duplicate-head": "off",

      // React
      "react-hooks/exhaustive-deps": "warn",
      "react/display-name": "off",
      "react/jsx-pascal-case": "error",
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never", propElementValues: "always" }],

      // TypeScript
      "@typescript-eslint/prefer-namespace-keyword": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      // Accessibility
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",

      // React Compiler rules shipped with eslint-plugin-react-hooks 7 (kept off)
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
  {
    files: ["**/?(*.)+(spec|test).[jt]s?(x)"],
    rules: {
      ...testingLibrary.configs.react.rules,
    },
  },
  {
    files: ["**/integrationTests/**"],
    rules: {
      "testing-library/prefer-screen-queries": "off",
    },
  },
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: "return",
        },
        { blankLine: "always", prev: ["directive", "if", "type"], next: "*" },
      ],
    },
  },
])

export default eslintConfig
