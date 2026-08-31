```typescript
/**
 * Determine the array of extensions that should be used to resolve modules.
 */
resolve: {
  extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  modules: [webpackPaths.srcPath, 'node_modules'],
  fallback: { path: false }
},
```