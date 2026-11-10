```javascript
function replace(text, chinese, replaceString) {
    let textArr = text.split(/intl\.get\(.+?\)/);
    const newArr = JSON.parse(JSON.stringify(textArr));
    textArr.forEach((item, index, arr) => {
        arr[index] = item.replace(chinese, replaceString);
    });
    newArr.forEach((item, index, arr) => {
        if (item !== textArr[index]) {
            text = text.replace(item, textArr[index]);
        }
    })
    return text;
}
```