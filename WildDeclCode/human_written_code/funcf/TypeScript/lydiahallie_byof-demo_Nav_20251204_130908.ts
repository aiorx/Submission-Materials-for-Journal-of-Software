```javascript
function cn(...args) {
  return args
    .map(arg => {
      if (typeof arg === 'string') {
        return arg;
      } else if (typeof arg === 'object' && arg !== null) {
        return Object.entries(arg)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}
```