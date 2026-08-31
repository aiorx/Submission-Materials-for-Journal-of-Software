```javascript
Array.from(scoreMap.keys()).sort((a, b) => b - a).forEach(key => {
    if (pairsCounted >= pairAmount) return; // Stop if enough pairs found

    if (scoreMap.get(key) >= 2) {
        result += key * 2;
        pairsCounted++;
    }
});
```