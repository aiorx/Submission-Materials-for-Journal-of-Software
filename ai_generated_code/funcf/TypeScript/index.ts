```typescript
function isNumericAndLessThanFourDigits(input: string): boolean { // Thanks ChatGPT
  const regex = /^\d{1,4}(\/\d{1,4})?$/;
  return regex.test(input);
}
```