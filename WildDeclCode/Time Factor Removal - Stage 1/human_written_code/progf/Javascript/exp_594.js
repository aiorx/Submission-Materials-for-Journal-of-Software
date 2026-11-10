"use strict";

var fs = require("fs");
var https = require("https");
var mkdirp = require("mkdirp");
var throughParallel = require("through2-parallel");
var puppeteer = require("puppeteer");
var fromArray = require("from2-array");
var logSymbols = require('log-symbols');

var user = process.argv[2];
var pass = process.argv[3];
var course = process.argv[4];
var courseid = process.argv[5]
var hd = process.argv[6];
var pathDirectory = process.argv[7] || "DownLoads/";
var url = "https://frontendmasters.com";
var SECONDES = 1000;

if (!course || !user || !pass) {
  process.stderr.write("you must provide course, username and your password");
  return;
}

var directory = pathDirectory + course;

mkdirp(directory, function(err) {
  if (err) console.error(err);
});

(async function () {
  /* TODO: the default mode is headless: true but, it simply don't work
   * Need to understand why
   */
  var browser = await puppeteer.launch({ headless: false });
  var page = await browser.newPage();
  await page.goto(url + "/login");

  await page.waitFor(2 * SECONDES);

  await page.waitForSelector("#username");
  var username = await page.$("#username");
  await username.type(user);
  var password = await page.$("#password");
  await password.type(pass);
  var button = await page.$("button");
  await button.click();
  var selector = ".title a";
  await page.waitForSelector(selector);
  var obj = {
    selector,
    course
  };
  var link = await page.evaluate(obj => {
    var anchors = Array.from(document.querySelectorAll(obj.selector));
    return anchors
      .map(anchor => {
        return "" + (anchor.href) + "";
      })
      .filter(text => text.includes(obj.course))
      .pop();
  }, obj);

  await page.goto(link);
  selector = ".LessonListItem a";
  await page.waitForSelector(selector);
  var links = await page.evaluate(selector => {
    var anchors = Array.from(document.querySelectorAll(selector));
    return anchors.map(anchor => {
      return "" + (anchor.href) + "";
    });
  }, selector);
  var finalLinks = [];

  var newLink = links.map((item, index) => {
    return {
      index: index,
      link: item
    }
  })


  if (courseid) {
    var serchLink = "" + (url) + "/courses/" + (course) + "/" + (courseid) + "/"

    var useLink = newLink.filter(item => item.link === serchLink)[0]
    var index = useLink.index
    var link = useLink.link
    await page.goto(link);
    selector = "video";

    if (hd) {
      console.log("JE SUIS DANS HD");
      await page.waitForSelector(".fm-vjs-quality li");
      console.log("PAS VISIBLE4 ????");
      await page.waitFor(8 * SECONDES);
      await page.click(".fm-vjs-quality");
      await page.click(".fm-vjs-quality li");
    }
    console.log("JE SUIS SORTIS DE HD");

    await page.waitFor(8 * SECONDES);
    var videoLink = await page.evaluate(selector => {
      var video = Array.from(document.querySelectorAll(selector)).pop();
      return video.src;
    }, selector);

    var fileName = "" + (index+1) + "-" + link.split("/").filter(str => str.length).pop() + ".mp4";
    try {
      downloadVideo({ fileName, videoLink })
    } catch (err) {
      console.log(err)
    }
  } else {
    for (var templink of newLink.reverse()) {
      var index = templink.index
      var link = templink.link
      await page.goto(link);
      selector = "video";
      var stringhd = "(OUT OF HD)"
      if (hd) {
        stringhd = "(IN HD)"
        await page.waitForSelector(".fm-vjs-quality li");
        console.log("NOT VISIBLE ????");
        await page.waitFor(8 * SECONDES);
        await page.click(".fm-vjs-quality");
        await page.click(".fm-vjs-quality li");
      }
      await page.waitFor(8 * SECONDES);
      var videoLink = await page.evaluate(selector => {
        var video = Array.from(document.querySelectorAll(selector)).pop();
        return video.src;
      }, selector);

      var fileName = "" + (index+1) + "-" + link.split("/").filter(str => str.length).pop() + ".mp4";
      finalLinks.push({ fileName, videoLink });
      console.log(fileName, 'starting', stringhd)
      try {
        downloadVideo({ fileName, videoLink })
      } catch (err) {
        console.log(err)
      }
    }
    // console.log("Will start downloading videos");

    // finalLinks = removeAlreadyFetched(finalLinks);
    // downloadVideos(finalLinks);
  }

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

  function downloadVideo ({fileName, videoLink}) {
    if (videoLink) {
      https.get(videoLink, req =>
        req.pipe(
          fs.createWriteStream(directory + "/" + fileName).on("finish", () => {
            console.log(logSymbols.success, fileName);
          })
        )
      )
    }
  }

  process.on("uncaughtException", err => {
    console.log(err);
    console.log("You have reached maximum request limit");
    console.log("Sleeping for 15 minutes");
    finalLinks = removeAlreadyFetched(finalLinks);
    setTimeout(() => downloadVideos(finalLinks), SECONDES * 60 * 15);
  });
  function removeAlreadyFetched(arrLinks) {
    var alreadyFetched = fs.readdirSync(directory).map(file => file);
    return arrLinks.filter(
      ({ fileName }) => !alreadyFetched.includes(fileName)
    );
  }
})();
