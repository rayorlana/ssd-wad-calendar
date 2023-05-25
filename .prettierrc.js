/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 150,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  endOfLine: 'auto',
  importOrder: [
    '^react$',
    '^next$',
    // ext library & side effect imports
    '^@?\\w',
    '^\\u0000',
    // modules
    '^@/modules',
    // components
    '^@/components',
    // api services
    '^@/services',
    // react hooks
    '^@/hooks',
    // Other imports
    '^@/',
    // relative paths up until 3 level
    '^\\./?$',
    '^\\.(?!/?$)',
    '^\\.\\./?$',
    '^\\.\\.(?!/?$)',
    '^\\.\\./\\.\\./?$',
    '^\\.\\./\\.\\.(?!/?$)',
    '^\\.\\./\\.\\./\\.\\./?$',
    '^\\.\\./\\.\\./\\.\\.(?!/?$)',
    // types
    '^@/types',
    // others
    '^',
  ],
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    /**
     * make sure prettier-plugin-tailwindcss is always imported last due to compat issue
     * https://github.com/tailwindlabs/prettier-plugin-tailwindcss#compatibility-with-other-prettier-plugins
     */
    'prettier-plugin-tailwindcss',
  ],
};
