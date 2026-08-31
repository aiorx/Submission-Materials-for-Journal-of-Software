```js
const removeDeclarations = doc => {
  if (Array.isArray(doc)) {
    return doc.map(removeDeclarations);
  } else if (typeof doc === "object" && doc !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { declarations, ...rest } = doc;

    return Object.keys(rest).reduce((acc, key) => {
      acc[key] = removeDeclarations(rest[key]);

      return acc;
    }, {});
  }

  return doc;
};
```