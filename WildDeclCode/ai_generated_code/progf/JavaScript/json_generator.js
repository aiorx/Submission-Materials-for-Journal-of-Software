// this is a very basic data generator Crafted with basic coding tools and tweaked a bit
// it doesn't generate realistic data, but it's good enough for testing purposes
// this should be run without any relation to the rest of the project

const fs = require("fs");
const path = require("path");

function generateWeatherData(startTime, hours, min_level) {
  const data = [];
  const baseTime = new Date(startTime);

  for (let h = 0; h < hours; h++) {
    const time = new Date(baseTime);
    time.setHours(time.getHours() + h);

    const z = Array.from(
      { length: 40 },
      (_, i) => min_level + i * (Math.log(i + 2) * 70)
    );
    const wdir = z.map(() => Math.floor(Math.random() * 360));
    const wspd = z.map((_, i) =>
      Math.max(1, Math.log(i + 2) * 5 + Math.random() * 2)
    );
    const t = z.map((_, i) => 25 - i * 0.7 + (Math.random() - 0.5) * 0.5);
    const r = z.map(() => Math.max(0, Math.min(100, Math.random() * 50 + 20)));
    const vv = z.map(() => (Math.random() > 0.5 ? Math.random() * 1.5 : 0));
    const bl =
      1500 + Math.sin((h / 24) * Math.PI * 2) * 300 + Math.random() * 50;
    const rain = Math.random() > 0.8 ? Math.random() * 10 : 0;
    const cloud_low = Math.random() * 40;
    const cloud_med = Math.random() * 50;
    const cloud_high = Math.random() * 50;
    // Generate cloud patterns with more clear sky periods
    const isCloudyHour = Math.random() > 0.7; // 30% chance of clouds
    const cloudBase = 10 + Math.random() * 3; // Base height where clouds start
    const cloudDepth = 2 + Math.random() * 4; // How many levels the cloud spans
    cld_frac = z.map((_, i) => {
      if (!isCloudyHour) return Math.round(Math.random() * 5); // Very few or no clouds
      const distFromBase = Math.abs(i - cloudBase);
      const cloudiness =
        distFromBase < cloudDepth
          ? Math.max(0, 50 - distFromBase * 5 + Math.random() * 20)
          : Math.random() * 5;
      return Math.round(Math.max(0, Math.min(100, cloudiness)));
    });
    const isoTime = time.toISOString().split(":");

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

const min_level = Math.round(Math.random() * 500 + 500);
const weatherData = generateWeatherData("2024-10-30T03:00Z", 24, min_level);
console.log(__dirname);
fs.writeFileSync(
  path.join(__dirname, "arome_fake_data.json"),
  JSON.stringify({
    level: min_level,
    data: weatherData,
  })
);
console.log("generated data");
