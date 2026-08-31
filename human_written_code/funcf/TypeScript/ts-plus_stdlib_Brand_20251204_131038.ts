```ts
export function deriveMinLenValidation<B extends { length: number }, V extends `MinLen(${number})`>(
  ...[min]: V extends `MinLen(${infer N extends number})` ? [N] : never
): Brand.Validation<B, V> {
  return validation((b) => b.length >= min)
}
```