```tsx
const disableEvent = React.useCallback(
  (e: React.SyntheticEvent) => {
    e.persist();

    if (shouldDisable) {
      e.preventDefault();
      e.stopPropagation();
    }
  },
  [shouldDisable]
);
```