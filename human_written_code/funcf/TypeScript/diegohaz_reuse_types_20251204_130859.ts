```ts
/**
 * Transform `"a" | "b"` into `"a" & "b"`
 * @template U Union
 */
export type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;
```