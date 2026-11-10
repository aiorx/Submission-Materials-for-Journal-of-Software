const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 3000;

const cache = {};

const get = function (username, size) {
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

app.get("/:user", async function (req, res, next) {
  const result = await get(req.params.user, "_200x200");
  if (!result) return res.status(404).send('Not Found');
  request(result).pipe(res);
});

app.get("/:user/big", async function (req, res, next) {
  const result = await get(req.params.user, "_400x400");
  if (!result) return res.status(404).send('Not Found');
  request(result).pipe(res);
});

app.get("/:user/full", async function (req, res, next) {
  const result = await get(req.params.user, "");
  if (!result) return res.status(404).send('Not Found');
  request(result).pipe(res);
});

app.get("/:user/mini", async function (req, res, next) {
  const result = await get(req.params.user, "_mini");
  if (!result) return res.status(404).send('Not Found');
  request(result).pipe(res);
});

app.listen(port, function () { return console.log("Example app listening at http://localhost:" + (port) + ""); });

module.exports = app;
