```typescript
task('golf:script', 'Runs a gas cost comparison using a script')
  .addPositionalParam('path', 'Path to the script')
  .setAction(async (args) => {
    await runScript(args.path);
  });
```