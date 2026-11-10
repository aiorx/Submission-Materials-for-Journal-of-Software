```js
const generateRequestHeaders = (headers) => {
  if (headers) {
    const requestDict = {};
    let headerValue;
    let headerName;

    if (headers instanceof Array) {
      headers.forEach(header => {
        const i = header.indexOf(':');
        headerName = header.substr(0, i);
        headerValue = header.substr(i+1);
        requestDict[headerName] = headerValue;
      });
    } else {
      const i = headers.indexOf(':');
      headerName = headers.substr(0, i);
      headerValue = headers.substr(i+1);
      requestDict[headerName] = headerValue;
    }
    return requestDict;
  }

  return;
};
```