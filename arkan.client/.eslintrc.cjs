module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'prettier', 'unused-imports'],
  rules: {
    // Enforce Prettier code formatting
    'prettier/prettier': 'error',
    // Enforce concise arrow function bodies, only when they do not return an object
    'arrow-body-style': ['error', 'as-needed'],
    // Enforce curly braces for control statements
    curly: 1,
    // Allow wrapping of JSX elements if they exceed the maximum line length
    'jsx-wrap-multiline': 0,
    // Disable the need to import React when using JSX
    'react/react-in-jsx-scope': 0,
    // Enforce camelcase naming for variables and properties
    camelcase: 1,
    // Enforce the use of single quotes for strings, except for template literals
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    // Prevent duplicate imports
    'no-duplicate-imports': 'error',
    // Prevent unused imports
    'unused-imports/no-unused-imports': 'error',

    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/prop-types': 'off'
  }
};
