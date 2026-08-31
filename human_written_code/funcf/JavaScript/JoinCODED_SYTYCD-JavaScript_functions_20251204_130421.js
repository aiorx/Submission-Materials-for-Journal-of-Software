```js
function getAuthorByName(authorName, authors) {
  return authors.find(
    author => author.name.toLowercase() === authorName.toLowercase()
  );
}
```