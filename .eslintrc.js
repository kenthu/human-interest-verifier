module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    'import/order': [
      'error',
      { 'newlines-between': 'always', alphabetize: { order: 'asc' } },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
};
