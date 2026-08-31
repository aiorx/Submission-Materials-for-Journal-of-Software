```javascript
function getCookie(cookieName, defaultVal){ // from github copilot
  cookie = document.cookie;
  idxStart = cookie.search(cookieName+'=');
  if(idxStart == -1){
    return defaultVal;
  }
  idxStart += cookieName.length + 1
  idxEnd = idxStart;
  while(idxEnd < cookie.length-1){
    if(cookie[idxEnd] == ';'){
      break;
    }
    idxEnd++;
  }
  return cookie.slice(idxStart, idxEnd);
}
```