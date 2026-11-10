/* tslint:disable no-console */

var decompress = require('decompress');
var fs = require('fs-extra');
var path = require('path');

var Progress = require('progress');
var _import = require('request');

var _import = require('./config');

function download(url: string, destPath: string) {
  return new Promise(function (resolve, reject) {
    console.log("Downloading GPG from " + (url) + ".");

    var req = request({
      url,
      headers: {
        "Accept": "application/octet-stream",
        "User-Agent": "squeegpg",
      },
    });

    req.pipe(fs.createWriteStream(destPath));

    req.on("error", (err: any) => {
      if (err.code === "ETIMEDOUT") {
        console.error(
          "A timeout occurred while downloading " + (url) + ". Check your Internet connection and try again. " +
          "If you are using a proxy, make sure that the HTTP_PROXY and HTTPS_PROXY environment variables " +
          "are set.",
        );
      } else {
        console.error("An error occurred while downloading " + (url) + ".", err);
      }
      reject(err);
    });

    req.on("response", (res: Response) => {
      if (res.statusCode !== 200) {
        console.error("Non-200 response returned from " + (url) + ": " + (res.statusCode) + ".");
        reject(new Error("Non-200 response"));
      }

      var len = parseInt(res.headers["content-length"] || "0", 10);

      var bar = new Progress("[:bar] :percent :etas", {
        complete: "=",
        incomplete: " ",
        width: 50,
        total: len,
      });

      res.on("data", (chunk) => bar.tick(chunk.length));
      res.on("end", () => {
        console.log("\n");
        resolve();
      });
    });
  });
}

async function main() {
  await fs.mkdirs(config.outputDir);

  var platform: IPlatform;
  if (!(process.platform in config.platforms)) {
    console.error("Unrecognized platform " + (process.platform) + ".");
    console.error("No binary distribution is available for your platform.");
    throw new Error("No binary distribution");
  } else {
    platform = config.platforms[process.platform] as IPlatform;
  }

  var url = "https://github.com/atom/squeegpg-native/releases/download/" + (config.nativeTag) + "/" + (platform.tarball) + "";
  var tarballPath = path.join(config.outputDir, platform.tarball);

  try {
    await download(url, tarballPath);
    await decompress(tarballPath, config.outputDir);
  } finally {
    await fs.remove(tarballPath);
  }
}

main().then(
  function () { return process.exit(0); },
  function (err) {
    // tslint:disable-next-line no-console
    console.error("Unable to download GPG archive", err);
    process.exit(1);
  },
);
