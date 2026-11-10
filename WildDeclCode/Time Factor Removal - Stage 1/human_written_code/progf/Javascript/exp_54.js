var path = require('path');
var url = require('url');

module.exports = function inDev {;
  return inDev
    ? "http://localhost:" + (process.env.ELECTRON_WEBPACK_WDS_PORT) + ""
    : url.format({
        pathname: path.resolve(__dirname, '../renderer', 'index.html'),
        protocol: 'file',
        slashes: true
      })
}
