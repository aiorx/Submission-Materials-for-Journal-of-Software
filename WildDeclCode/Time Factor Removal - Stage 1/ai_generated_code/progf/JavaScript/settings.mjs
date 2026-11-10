// settings.mjs (Composed with basic coding tools)
var fs = require('fs');
var path = require('path');

var CACHE_FILE_PATH = path.resolve(process.cwd(), ".cache.json");

var cache = new Map();

// Load values from .cache.json if it exists.
function loadCache() {
  try {
    var data = fs.readFileSync(CACHE_FILE_PATH, "utf-8");
    var json = JSON.parse(data);
    for (var key in json) {
      cache.set(key, json[key]);
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      // Set defaults if the file not found
      set("cookies", null);
    } else {
      throw err; // Re-throw errors other than "file not found"
    }
  }
}

// Save the values to .cache.json
function saveCache() {
  var json = Object.fromEntries(cache);
  // Ignore undefined values
  for (var key in json) {
    if (json[key] === undefined) {
      delete json[key];
    }
  }
  fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(json, null, 2));
}

// Set a key-value pair
function set(key, value) {
  if (value === undefined) {
    cache.delete(key);
  } else {
    cache.set(key, value);
  }
  saveCache();
}

// Get a value by its key
function get(key) {
  return cache.get(key);
}

// Initialization
loadCache();

module.exports.set = set;
module.exports.get = get;
