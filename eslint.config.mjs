import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import pluginNext from "@next/eslint-plugin-next";
import configPrettier from "eslint-config-prettier";
import { flatConfigs as pluginImport } from "eslint-plugin-import";
import pluginImportHelpers from "eslint-plugin-import-helpers";
import pluginJest from "eslint-plugin-jest";
import pluginJestDom from "eslint-plugin-jest-dom";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginPrettier from "eslint-plugin-prettier";
import * as pluginPromise from "eslint-plugin-promise";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginSonarjs from "eslint-plugin-sonarjs";
import pluginStorybook from "eslint-plugin-storybook";
import pluginTestingLibrary from "eslint-plugin-testing-library";
import * as pluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";
// import * as pluginTurbo from "eslint-plugin-turbo";

const ignoreConfig = [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "storybook-static/**",
      "coverage/**",
      ".next/**",
    ],
  },
];

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/**
 * Default ESLint configuration.
 *
 * This configuration is applied to all files, unless overridden by a more specific
 * configuration.
 *
 */
export default [
  //#region //! BASE CONFIGS
  {
    files: [
      "**/*.{js,mjs,cjs,jsx,ts,tsx}",
      "**/*/next-env.d.ts",
      "**/*/.config.{js,mjs,cjs,jsx,ts,tsx}",
      "**/*/.plop/**/*",
      "**/*/.storybook/**/*",
    ],
  },
  ...ignoreConfig,

  configPrettier,
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // pluginTurbo.default.configs["flat/recommended"], // Not needed - not a Turborepo project
  pluginUnicorn.default.configs["flat/recommended"],
  pluginImport.recommended,
  pluginImport.react,
  pluginImport.typescript,
  pluginPromise.default.configs["flat/recommended"],
  ...compat.extends("next/typescript"),

  {
    plugins: {
      prettier: pluginPrettier,
      sonarjs: pluginSonarjs,
      "import-helpers": pluginImportHelpers,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "tsconfig.json",
        },
        node: {
          alwaysTryTypes: true,
          project: "tsconfig.json",
        },
      },
      "import/parsers": {
        espree: [".js", ".cjs", ".mjs", ".jsx", ".tsx"],
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },

    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "comma-dangle": ["error", "always-multiline"],
      "import/export": "off",
      "import-helpers/order-imports": [
        "error",
        {
          newlinesBetween: "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
            ignoreCase: true,
          },
          groups: [["module"], ["/@//"], ["parent", "sibling", "index"]],
        },
      ],
      "import/namespace": "off",
      "import/no-absolute-path": "off",
      "import/no-cycle": "off",
      "import/no-named-as-default-member": "off",
      "import/no-relative-packages": "error",
      "import/no-relative-parent-imports": "off",
      "import/no-unresolved": "off",
      "import/order": "off",
      "import/prefer-default-export": "off",
      "no-console": [1, { allow: ["error", "warn"] }],
      "no-restricted-imports": [
        "error",
        {
          /* force absolute imports */
          patterns: [],
        },
      ],
      "no-return-await": "error",
      "prettier/prettier": "error",
      // "turbo/no-undeclared-env-vars": "warn",
      "unicorn/no-null": "off",
      "unicorn/prefer-global-this": "off",
      "unicorn/prefer-module": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true,
            pascalCase: true,
            kebabCase: true,
          },
        },
      ],
      eqeqeq: ["error", "smart"],
    },
  },
  //#endregion

  //#region //! REACT CONFIGS
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended?.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.es2025,
        ...globals.jest,
        ...globals.node,
        ...globals.serviceworker,
      },
    },
    settings: { react: { version: "detect" } },
  },
  pluginReact.configs.flat["jsx-runtime"],

  {
    plugins: {
      "jsx-a11y": pluginJsxA11y,
      "react-hooks": pluginReactHooks,
      storybook: pluginStorybook,
    },

    rules: {
      ...pluginReactHooks.configs.recommended.rules,

      "react/button-has-type": "error",
      "react/hook-use-state": "error",
      "react/jsx-curly-brace-presence": ["error", "never"],
      "react/jsx-sort-props": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  ...pluginStorybook.configs["flat/recommended"],
  //#endregion

  //#region //! REACT CONFIGS - tests
  {
    files: [
      "**/*.test.{js,mjs,cjs,jsx,ts,tsx}",
      "**/*.spec.{js,mjs,cjs,jsx,ts,tsx}",
    ],
    plugins: {
      jest: pluginJest,
      "jest-dom": pluginJestDom,
      "testing-library": pluginTestingLibrary,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...pluginJest.configs.all.rules,
      ...pluginTestingLibrary.configs.react.rules,
      ...pluginJestDom.configs.recommended.rules,
      "jest/max-expects": "off",
      "jest/no-conditional-expect": "off",
      "jest/no-conditional-in-test": "off",
      "jest/no-hooks": "off",
      "jest/no-untyped-mock-factory": "off",
      "jest/prefer-importing-jest-globals": "off",
      "jest/require-hook": "off",
      "jest/unbound-method": "off",
      "react/react-in-jsx-scope": "off",
      "testing-library/await-async-query": "off",
      "testing-library/no-await-sync-query": "off",
      "testing-library/no-container": "off",
      "testing-library/no-debugging-utils": "error",
      "testing-library/no-node-access": [
        "error",
        { allowContainerFirstChild: true },
      ],
      "testing-library/prefer-screen-queries": "off",
    },
  },
  //#endregion

  //#region //! NEXT CONFIGS
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs?.recommended?.rules,
      ...pluginNext.configs?.["core-web-vitals"]?.rules,

      // "no-restricted-imports": [
      //   "error",
      //   {
      //     name: "next/link",
      //     message: "Please import from `@/i18n/routing` instead.",
      //   },
      //   {
      //     name: "next/navigation",
      //     importNames: [
      //       "redirect",
      //       "permanentRedirect",
      //       "useRouter",
      //       "usePathname",
      //     ],
      //     message: "Please import from `@/i18n/routing` instead.",
      //   },
      // ],
    },
  },
  //#endregion
];
