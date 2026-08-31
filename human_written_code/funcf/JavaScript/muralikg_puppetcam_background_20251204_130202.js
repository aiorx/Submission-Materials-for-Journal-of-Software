```js
function onStopRecording() {
  var superBuffer = new Blob(chunks, {
    type: 'video/webm'
  });

  var url = URL.createObjectURL(superBuffer);

  chrome.downloads.download({
    url: url,
    filename: filename
  }, () => {});
}
```