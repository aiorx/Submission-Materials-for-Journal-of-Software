```javascript
results.sort((a, b) => {
    const extractNumber = str => {
        const match = str.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };

    const nameA = a.model || a.lumia || "";
    const nameB = b.model || b.lumia || "";

    const baseA = nameA.match(/Lumia \d+/)?.[0] || nameA;
    const baseB = nameB.match(/Lumia \d+/)?.[0] || nameB;

    if (baseA === baseB) {
        return nameA.localeCompare(nameB); // Sort by full name when base matches
    }

    return extractNumber(baseA) - extractNumber(baseB);
});
```