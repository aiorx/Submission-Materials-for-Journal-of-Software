```typescript
const getDefaultFetchFunction = (): FetchFunction => {
  if (typeof window === 'undefined') {
    return (): Promise<Response> => {
      return Promise.reject(
        new Error('Cannot find `window`. Use `createUseFetch` to provide a custom `fetch` function.'),
      );
    };
  }
  if (typeof window.fetch === 'undefined') {
    return (): Promise<Response> => {
      return Promise.reject(
        new Error('Cannot find `window.fetch`. Use `createUseFetch` to provide a custom `fetch` function.'),
      );
    };
  }
  return window.fetch;
};
```