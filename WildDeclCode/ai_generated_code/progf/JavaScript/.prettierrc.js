// Supported via standard GitHub programming aids
/**
 * Prettier configuration for WikiFlow 2025
 * @see https://prettier.io/docs/en/options.html
 */
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.{ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.{json,jsonc}',
      options: {
        parser: 'json',
        tabWidth: 2,
      },
    },
    {
      files: '*.{css,scss}',
      options: {
        parser: 'css',
        singleQuote: false,
      },
    },
  ],
};
