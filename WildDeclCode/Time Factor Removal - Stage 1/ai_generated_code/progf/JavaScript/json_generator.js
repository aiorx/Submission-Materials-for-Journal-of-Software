// this is a very basic data generator Crafted with basic coding tools and tweaked a bit
// it doesn't generate realistic data, but it's good enough for testing purposes
// this should be run without any relation to the rest of the project

var fs = require("fs");
var path = require("path");

function generateWeatherData(startTime, hours, min_level) {
  var data = [];
  var baseTime = new Date(startTime);

  for (var h = 0; h < hours; h++) {
    var time = new Date(baseTime);
    time.setHours(time.getHours() + h);

    var z = Array.from(
      { length: 40 },
      function (_, i) { return min_level + i * (Math.log(i + 2) * 70); });
    var wdir = z.map(function () { return Math.floor(Math.random() * 360); });
    var wspd = z.map(function (_, i) { return Math.max(1, Math.log(i + 2) * 5 + Math.random() * 2); });
    var t = z.map(function (_, i) { return 25 - i * 0.7 + (Math.random() - 0.5) * 0.5; });
    var r = z.map(function () { return Math.max(0, Math.min(100, Math.random() * 50 + 20)); });
    var vv = z.map(function () { return (Math.random() > 0.5 ? Math.random() * 1.5 : 0); });
    var bl =
      1500 + Math.sin((h / 24) * Math.PI * 2) * 300 + Math.random() * 50;
    var rain = Math.random() > 0.8 ? Math.random() * 10 : 0;
    var cloud_low = Math.random() * 40;
    var cloud_med = Math.random() * 50;
    var cloud_high = Math.random() * 50;
    // Generate cloud patterns with more clear sky periods
    var isCloudyHour = Math.random() > 0.7; // 30% chance of clouds
    var cloudBase = 10 + Math.random() * 3; // Base height where clouds start
    var cloudDepth = 2 + Math.random() * 4; // How many levels the cloud spans
    cld_frac = z.map(function (_, i) {
      if (!isCloudyHour) return Math.round(Math.random() * 5); // Very few or no clouds
      var distFromBase = Math.abs(i - cloudBase);
      var cloudiness =
        distFromBase < cloudDepth
          ? Math.max(0, 50 - distFromBase * 5 + Math.random() * 20)
          : Math.random() * 5;
      return Math.round(Math.max(0, Math.min(100, cloudiness)));
    });
    var isoTime = time.toISOString().split(":");

    data.push({
      time: isoTime[0] + ":" + isoTime[1] + "Z",
      z,
      wdir,
      wspd,
      t,
      r,
      vv,
      bl,
      rain: parseFloat(rain.toFixed(1)),
      cloud_thr: parseFloat((cloud_low + cloud_med + cloud_high).toFixed(1)),
      cloud_low: parseFloat(cloud_low.toFixed(1)),
      cloud_med: parseFloat(cloud_med.toFixed(1)),
      cloud_high: parseFloat(cloud_high.toFixed(1)),
      cld_frac,
    });
  }

  return data;
}

var min_level = Math.round(Math.random() * 500 + 500);
var weatherData = generateWeatherData("2024-10-30T03:00Z", 24, min_level);
console.log(__dirname);
fs.writeFileSync(
  path.join(__dirname, "arome_fake_data.json"),
  JSON.stringify({
    level: min_level,
    data: weatherData,
  })
);
console.log("generated data");
