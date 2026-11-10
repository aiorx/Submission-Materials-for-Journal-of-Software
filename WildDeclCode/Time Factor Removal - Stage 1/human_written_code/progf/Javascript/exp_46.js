var readFile = require('fs/promises').readFile;
var path = require('path');

var data = {};

const JSONLoader = async function (model) {
  if (!model) {
    return;
  }
  if (!data[model]) {
    data[model] = JSON.parse(await readFile(path.resolve(process.cwd(), "./public/data/" + (model) + ".json")));
  }
  return data[model];
};
