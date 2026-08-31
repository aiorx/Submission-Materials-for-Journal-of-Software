```js
function downloadVideos(arrLinks) {
  fromArray
    .obj(arrLinks)
    .pipe(
      throughParallel.obj({ concurrency: 3 }, ({ fileName, videoLink }, enc, next) => {
          console.log("Downloading:" + fileName);
            https.get(videoLink, req =>
              req.pipe(
                fs
                  .createWriteStream(directory + "/" + fileName)
                  .on("finish", () => {
                    console.log(logSymbols.success, fileName);
                    next();
                  })
              )
            );
        }
      )
    )
    .on("finish", () => console.log("All video downloaded"));
}
```