```js
test('`filter2` is added to [].__proto__', () => {
  expect([].filter2)
    .toBeInstanceOf(Function);
});
```