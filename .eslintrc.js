module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:react/recommended', 'prettier', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // You can add specific rules here
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
