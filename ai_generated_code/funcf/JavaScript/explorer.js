```js
function sliceString(str, num) { //Crafted with standard coding tools
    // Check if the string is longer than num characters
    if (str.length > num) {
        return `${str.slice(0, num)}...`.replaceAll(`<p>`, "").replaceAll(`</p>`, "").replaceAll("\n", "");
    }
    // If the string is not longer than num characters, return it as is
    return `${str}`.replaceAll("\n", "");
}
```
```js
function searchThreads(threads, searchTerm) { // Crafted with standard coding tools
    searchTerm = searchTerm.toLowerCase();
    return threads.filter(thread => {
        let strings = []
        for (let each of thread.convo){
            strings.push(each.text)
        }
        return (
            strings.some(message => message.toLowerCase().includes(searchTerm)) ||
            (thread.title && thread.title.toLowerCase().includes(searchTerm))
        );
    });
}
```
```js
function searchList(convo, searchTerm) { // Crafted with standard coding tools
    let strings = []
    for (let message of convo){
        strings.push(message.text)
    }
    searchTerm = searchTerm.toLowerCase();
    const matchingStrings = strings.filter(string => string?.toLowerCase()?.includes(searchTerm)) ?? [];

    return matchingStrings.map(string => {
        const index = string.toLowerCase().indexOf(searchTerm);
        const startIndex = Math.max(0, index - 50);
        const endIndex = Math.min(string.length, index + 50);

        let substring = string.substring(startIndex, endIndex);
        if (startIndex > 0) {
            substring = "..." + substring;
        }
        if (endIndex < string.length) {
            substring = substring + "...";
        }

        // use the original case of the search term when highlighting it
        const searchTermRegex = new RegExp(searchTerm, "gi");
        return substring.replace(searchTermRegex, `<span class="highlight">$&</span>`);
    }).join(", ");
}
```