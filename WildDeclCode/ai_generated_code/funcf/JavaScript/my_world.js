```js
for (let [ni, nj] of adjacent) {
  if ((clicks[[ni, nj]] | 0) % 2 === 1) {
    let dx = (ni - i - (nj - j)) * (tw / 2);
    let dy = (ni - i + (nj - j)) * (th / 2);
    strokeWeight(2)
    line(0, 0, -dx, dy);
  }
}
```