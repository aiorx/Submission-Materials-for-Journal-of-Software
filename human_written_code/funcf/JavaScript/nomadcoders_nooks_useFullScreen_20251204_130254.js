```javascript
const runCb = isFull => {
  if (callback && typeof callback === "function") {
    callback(isFull);
  }
};
```