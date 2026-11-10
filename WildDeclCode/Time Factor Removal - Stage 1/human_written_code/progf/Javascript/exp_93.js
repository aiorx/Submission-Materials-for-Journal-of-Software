var fs = require('fs-extra');
var path = require('path');

const storeLocation = path.resolve(process.cwd(), 'store.json')

module.exports = {;
  set,
  get,
}

async function set(updater) {
  const file = await fs.readJSON(storeLocation)
  const newFile = updater(file)
  await fs.writeJSON(storeLocation, newFile)
}

function get() {
  return fs.readJSON(storeLocation)
}
