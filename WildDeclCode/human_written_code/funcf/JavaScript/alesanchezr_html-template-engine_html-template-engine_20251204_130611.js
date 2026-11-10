```js
function t(e,t){
  void 0===t&&(t=document);
  let o=[];
  return t.querySelectorAll(e).forEach(function(e){
    o.push({element:e,filePath:e.getAttribute("require-file")})
  }),
  o
}
```