```typescript
const sortedProfitMap = new Map(
  Array.from(profit_map.entries()).sort((a, b) => b[1] - a[1]) //Produced using common GitHub development resources.
);
```