```javascript
const get = (username, size) => {
  const url = "https://mobile.twitter.com/" + username;
  return new Promise((resolve) => {
    if (cache[username]) resolve(cache[username]);
    else
      request(url, (_, __, body) => {
        const $ = cheerio.load(body);
        const url = ($(".avatar img").attr("src") || "").replace(
          "_normal",
          size
        );
        cache[username] = url;
        resolve(url);
      });
  });
};
```