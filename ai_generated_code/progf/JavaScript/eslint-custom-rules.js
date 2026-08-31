// Aided with basic GitHub coding tools
/**
 * Custom ESLint rules for WikiFlow 2025
 * These rules ensure consistent code structure across the project
 */

module.exports = {
  meta: {
    name: 'wikiflow-custom-rules',
    version: '1.0.0',
  },
  rules: {
    // Ensure proper error handling in async functions
    'require-async-error-handling': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce proper error handling in async functions',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: null,
        schema: [],
      },
      create(context) {
        return {
          'TryStatement:exit'(node) {
            if (!node.finalizer && !node.handler) {
              context.report({
                node,
                message: 'Try block should have either a catch or finally clause',
              });
            }
          },
          'CallExpression:exit'(node) {
            if (
              node.callee.type === 'MemberExpression' &&
              node.callee.property.name === 'catch' &&
              node.arguments.length === 0
            ) {
              context.report({
                node,
                message: 'Promise.catch() should handle the error parameter',
              });
            }
          },
        };
      },
    },

    // Enforce import grouping
    'organized-imports': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce organized imports in a standard pattern',
          category: 'Style',
          recommended: true,
        },
        fixable: null,
        schema: [],
      },
      create(context) {
        return {
          'Program:exit'(node) {
            const sourceCode = context.getSourceCode();
            const importDeclarations = node.body.filter(node => node.type === 'ImportDeclaration');

            if (importDeclarations.length <= 1) {
              return;
            }

            let lastImportRank = -1;

            for (const importDeclaration of importDeclarations) {
              const importSource = importDeclaration.source.value;
              let currentRank;

              if (importSource.startsWith('react')) {
                currentRank = 0;
              } else if (importSource.startsWith('next')) {
                currentRank = 1;
              } else if (importSource.startsWith('@solana')) {
                currentRank = 2;
              } else if (importSource.startsWith('@')) {
                currentRank = 3;
              } else if (importSource.startsWith('./') || importSource.startsWith('../')) {
                currentRank = 5;
              } else {
                currentRank = 4;
              }

              if (currentRank < lastImportRank) {
                context.report({
                  node: importDeclaration,
                  message:
                    'Imports should be organized by: React, Next.js, Solana, external libraries, and then local imports',
                });
              }

              lastImportRank = currentRank;
            }
          },
        };
      },
    },
  },
};
