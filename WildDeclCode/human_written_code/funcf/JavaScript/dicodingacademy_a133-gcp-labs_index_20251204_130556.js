```js
Accepts.prototype.encoding =
Accepts.prototype.encodings = function (encodings_) {
  var encodings = encodings_

  // support flattened arguments
  if (encodings && !Array.isArray(encodings)) {
    encodings = new Array(arguments.length)
    for (var i = 0; i < encodings.length; i++) {
      encodings[i] = arguments[i]
    }
  }

  // no encodings, return all requested encodings
  if (!encodings || encodings.length === 0) {
    return this.negotiator.encodings()
  }

  return this.negotiator.encodings(encodings)[0] || false
}
```