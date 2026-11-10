```typescript
const readFile = TE.taskify<fs.PathLike, string, NodeJS.ErrnoException, string>(fs.readFile)
```