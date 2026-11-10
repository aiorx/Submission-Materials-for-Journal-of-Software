```js
function findById(id) {
  return db('posts').where({ id: Number(id) }).first()
}
```