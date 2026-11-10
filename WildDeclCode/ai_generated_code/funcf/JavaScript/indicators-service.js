```javascript
applyToFixed(obj) {
    // Iterate through each property of the object
    for (let key in obj) {
        if (typeof obj[key] === "number") {
            // If the value is a number, apply .toFixed(2)
            obj[key] = parseFloat(obj[key].toFixed(2));
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
            // If the value is an object, recursively call the function
            this.applyToFixed(obj[key]);
        }
    }
    return obj;
}
```