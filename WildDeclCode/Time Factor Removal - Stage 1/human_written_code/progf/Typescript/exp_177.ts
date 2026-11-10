var flags = require('./flags.ts');
var devServer = require('../dev/server.ts');

/**
 * Function for when the dev command is called
 * @param flag User flags. -h or --help.
 */
const DevProject = function (flag: string) {
  if (flags['help'][flag]) {
    console.log("you requested help (" + (flag) + ") with the dev command");
    return false;
  }
  devServer();
  return true
}
