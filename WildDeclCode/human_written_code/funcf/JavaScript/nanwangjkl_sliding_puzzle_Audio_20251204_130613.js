```js
canPlayType(mediaType = '') {
  if (typeof mediaType !== 'string') {
    return ''
  }

  if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
    return 'probably'
  }
  return ''
}
```