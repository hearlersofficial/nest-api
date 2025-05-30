module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "module-resolver", "simple-import-sort", "prettier"],
  extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js", ".prettierrc.js"],
  rules: {
    "simple-import-sort/imports": [
      "error",
      {
        groups: [["^~/(.*)$", "^~shared/(.*)$", "^~users/(.*)$", "^~counselings/(.*)$", "~proto/(.*)$"]],
      },
    ],
    "module-resolver/use-alias": [
      "error",
      {
        alias: {
          "~users": "./src/services/users",
          "~counselings": "./src/services/counselings",
          "~shared": "./src/shared",
          "~proto": "./src/gen",
          "~": "./src",
        },
      },
    ],
    "prettier/prettier": "error",
    semi: ["error", "always"],
    "no-unused-vars": "off",
    "eol-last": ["error", "always"],
    quotes: ["error", "double"],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  overrides: [
    {
      files: ["src/services/users/**/*.{js,ts}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["./**", "../**", "~counselings/*", "~/*"],
                message: "Users 서비스는 절대경로로 자신의, 혹은 공유된 모듈만 import할 수 있습니다.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/services/counselings/**/*.{js,ts}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["./**", "../**", "~users/*", "~/*"],
                message: "Counseling 서비스는 절대경로로 자신의, 혹은 공유된 모듈만 import할 수 있습니다.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/shared/**/*.{js,ts}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["./**", "../**", "~users/*", "~counselings/*", "~/*"],
                message: "Shared 모듈은 절대경로로 자신의, 혹은 공유된 모듈만 import할 수 있습니다.",
              },
            ],
          },
        ],
      },
    },
  ],
};
