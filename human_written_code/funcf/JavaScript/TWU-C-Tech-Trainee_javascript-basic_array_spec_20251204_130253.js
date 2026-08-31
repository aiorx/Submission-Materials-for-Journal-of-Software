```javascript
it('should be able to push elements into array', () => {
  const array = [1, 2, 3, 4, 5];

  array.push(6, 7, 8);

  expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
});
```