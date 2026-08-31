```javascript
function detectPushCommand(data) {
  const patterns = ['To(.+)\.git'];
  const antiPatterns = ['error:'];
  return new RegExp(`(${patterns.join(')|(')})`).test(data) && !new RegExp(`(${antiPatterns.join(')|(')})`).test(data);
}
```