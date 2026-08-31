```typescript
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    router.go('/', true);
  }
}
```