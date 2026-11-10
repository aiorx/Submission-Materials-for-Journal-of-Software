```ts
export type MatchingKeys<
  TRecord,
  TMatch,
  K extends keyof TRecord = keyof TRecord
> = K extends (TRecord[K] extends TMatch ? K : never) ? K : never;
```