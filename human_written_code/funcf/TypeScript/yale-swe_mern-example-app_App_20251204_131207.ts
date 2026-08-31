```typescript
const addDoggo = useCallback(
  (doggo: Doggo) => {
    setDoggos([...doggos, doggo]);
  },
  [doggos]
);
```