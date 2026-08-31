```js
categories.forEach((category, i) => {
  let [name, id] = category
  data.categories[i] = {id: id, name: name, emojis: []}
  categoriesIndex[name] = i
})
```