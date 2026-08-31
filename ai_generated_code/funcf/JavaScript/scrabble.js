```js
const sortObject = (obj) => {
    return Object.fromEntries(
        Object.entries(obj)
            .sort((a, b) => {
                // Sort by descending value
                if (b[1] !== a[1]) return b[1] - a[1];
                // If values are equal, sort keys alphabetically
                return a[0].localeCompare(b[0]);
            })
    );
}
```