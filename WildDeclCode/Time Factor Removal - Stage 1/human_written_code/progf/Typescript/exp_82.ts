/* eslint-disable @typescript-eslint/no-var-requires */

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV =
    process.env.NOW_REGION === "dev1" ? "development" : "production";
}

var Server = require.Server;("http");
var Bridge = require.Bridge;("./now__bridge");
var frontity = require("./index").default;

var server = new Server(frontity);
var bridge = new Bridge(server);
bridge.listen();

exports.launcher = bridge.launcher;
