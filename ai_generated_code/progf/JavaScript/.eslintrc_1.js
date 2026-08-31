// Aided with basic GitHub coding tools
/**
 * ESLint configuration for WikiFlow 2025
 * Optimized for Next.js + React 19 + TypeScript
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    node: true,
    es2023: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'next/core-web-vitals',
    'prettier', // Make sure this is last to override other configs
  ],
  plugins: ['@typescript-eslint', 'react', 'jsx-a11y', 'prettier', 'wikiflow-custom-rules'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // JavaScript best practices
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-unused-vars': 'off', // Handled by TypeScript
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': ['error', 'always'],

    // TypeScript rules
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',

    // React rules
    'react/prop-types': 'off', // Not needed with TypeScript
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Accessibility
    'jsx-a11y/anchor-is-valid': ['error', { components: ['Link'], specialLink: ['href'] }],

    // Prettier integration
    'prettier/prettier': ['warn', {}, { usePrettierrc: true }],

    // Custom WikiFlow rules
    'wikiflow-custom-rules/require-async-error-handling': 'warn',
    'wikiflow-custom-rules/organized-imports': 'warn',
  },
  overrides: [
    // Test files
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'react/display-name': 'off',
      },
    },
    // Next.js specific files
    {
      files: ['src/app/**/*.ts?(x)'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};
