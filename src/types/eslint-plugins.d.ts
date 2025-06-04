/* eslint-disable import-helpers/order-imports */

declare module "@next/eslint-plugin-next" {
  import type { ESLint } from "eslint";

  const plugin: ESLint.Plugin & {
    configs?: {
      recommended?: ESLint.Config & { rules?: ESLint.Plugin.RulesRecord };
      "core-web-vitals"?: ESLint.Config & { rules?: ESLint.Plugin.RulesRecord };
    };
  };
  export default plugin;
}

declare module "eslint-plugin-import" {
  import type { ESLint } from "eslint";

  export const flatConfigs: {
    recommended: ESLint.FlatConfig;
    typescript: ESLint.FlatConfig;
    errors: ESLint.FlatConfig;
    warnings: ESLint.FlatConfig;
    react: ESLint.FlatConfig;
  };

  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module "eslint-plugin-import-helpers" {
  import type { ESLint } from "eslint";

  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module "eslint-plugin-promise" {
  import type { ESLint } from "eslint";

  const plugin: ESLint.Plugin & {
    configs: {
      recommended: ESLint.Config;
      "flat/recommended": ESLint.FlatConfig;
    };
    default: {
      configs: {
        "flat/recommended": ESLint.FlatConfig;
      };
    };
  };

  export = plugin;
}
