```js
(async () => {
  await new Promise(res => {
    setTimeout(res, 10000000);
  });
})();
```