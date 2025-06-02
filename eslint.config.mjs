import { FlatCompat } from "@eslint/eslintrc";
// import pluginJest from "eslint-plugin-jest";
import pluginJs from "@eslint/js";
import pluginNext from "@next/eslint-plugin-next";
import configPrettier from "eslint-config-prettier";
import { flatConfigs as pluginImport } from "eslint-plugin-import";
import pluginImportHelpers from "eslint-plugin-import-helpers";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginPrettier from "eslint-plugin-prettier";
import pluginPromise from "eslint-plugin-promise";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginSonarjs from "eslint-plugin-sonarjs";
import pluginStorybook from "eslint-plugin-storybook";
// Tailwind CSS v4 is not compatible with eslint-plugin-tailwindcss (requires v3.4.0+)
import pluginTurbo from "eslint-plugin-turbo";
// import pluginUnicorn from "eslint-plugin-unicorn"; // Temporarily disabled due to compatibility issues
import globals from "globals";
import tseslint from "typescript-eslint";

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
  //! BASE CONFIGS
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
  pluginTurbo.configs["flat/recommended"],
  pluginImport.recommended,
  pluginImport.react,
  pluginImport.typescript,
  pluginPromise.configs["flat/recommended"],
  ...compat.extends("next/typescript"),

  {
    plugins: {
      prettier: pluginPrettier,
      sonarjs: pluginSonarjs,
      // unicorn: pluginUnicorn, // Temporarily disabled due to compatibility issues
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
      "turbo/no-undeclared-env-vars": "warn",
      // "unicorn/no-null": "off",
      // "unicorn/prefer-global-this": "off",
      // "unicorn/prefer-module": "off",
      // "unicorn/prevent-abbreviations": "off",
      eqeqeq: ["error", "smart"],
    },
  },

  //! REACT CONFIGS
  // ...pluginTailwindcss.configs["flat/recommended"],

  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
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
      // tailwindcss: pluginTailwindcss,
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

  //! REACT CONFIGS - tests
  {
    files: ["**/*.spec.{js,mjs,cjs,jsx,ts,tsx}"],
  },
  // Jest and Testing Library configs commented out as testing is not implemented yet
  // pluginJest.configs["flat/all"],
  // pluginTestingLibrary.configs["flat/react"],
  // {
  //   plugins: { jest: pluginJest },
  //   languageOptions: {
  //     globals: pluginJest.environments.globals.globals,
  //   },
  //   rules: {
  //     "jest/max-expects": "off",
  //     "jest/no-conditional-expect": "off",
  //     "jest/no-conditional-in-test": "off",
  //     "jest/no-hooks": "off",
  //     "jest/no-untyped-mock-factory": "off",
  //     "jest/prefer-importing-jest-globals": "off",
  //     "jest/require-hook": "off",
  //     "jest/unbound-method": "off",
  //     "react/react-in-jsx-scope": "off",
  //     "testing-library/await-async-query": "off",
  //     "testing-library/no-await-sync-query": "off",
  //     "testing-library/no-container": "off",
  //     "testing-library/no-debugging-utils": "error",
  //     "testing-library/no-node-access": [
  //       "error",
  //       { allowContainerFirstChild: true },
  //     ],
  //     "testing-library/prefer-screen-queries": "off",
  //   },
  // },

  //! NEXT CONFIGS
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,

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
];
