```typescript
changeCount = (event: ChangeEvent<HTMLInputElement>) => {
  this.setState({ count: +event.target.value });
};
```