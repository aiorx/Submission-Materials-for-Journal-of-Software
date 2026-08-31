```typescript
it('should create a workspace with nestjs and angular', async done => {
  console.time('nest');
  const projectNestJs = uniq('nestjs');
  await runNxCommandAsync(`generate @nrwl/nest:application ${projectNestJs}`);
  console.timeEnd('nest');

  console.time('angular');
  const projectAngular = uniq('angular');
  await runNxCommandAsync(`generate @nrwl/angular:app ${projectAngular}`);
  console.timeEnd('angular');

  done();
});
```