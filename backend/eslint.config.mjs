import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  { 
    files: ["**/*.js"], 
    languageOptions: { sourceType: "commonjs" },
    rules: {
      "eqeqeq": "error",                      // Require === and !==
      "curly": "error",                       // Require curly braces for all control statements
      "no-unused-vars": ["error", {            // Warn on unused variables
        "vars": "all", "args": "after-used", "ignoreRestSiblings": false
      }],
      "semi": ["warn", "always"],            // Require semicolons
      "quotes": ["warn", "single"],          // Use single quotes
      "indent": ["warn", 2],                 // Enforce 2-space indentation
      "comma-dangle": ["error", "always-multiline"],  // Trailing commas in multiline objects/arrays
      "no-debugger": "error",                 // Disallow the use of debugger
      "prefer-const": "warn",                // Prefer const over let if variable is never reassigned
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];