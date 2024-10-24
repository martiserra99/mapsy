import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["example", "build", "node_modules"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
];
