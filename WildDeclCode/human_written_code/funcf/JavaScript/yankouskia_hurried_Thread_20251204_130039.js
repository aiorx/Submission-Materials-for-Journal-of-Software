```js
static fromScript(script, options) {
  const worker = new Worker(script, {
    ...options,
    eval: true,
  });

  return new Thread(worker);
}
```