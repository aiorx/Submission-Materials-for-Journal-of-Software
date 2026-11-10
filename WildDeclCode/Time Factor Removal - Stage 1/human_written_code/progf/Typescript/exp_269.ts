var buildList = require('./buildList').buildList;
var saveList = require('./buildList').saveList;
var VersionBump = require('./buildList').VersionBump;
var checksumAddresses = require('./checksum');
var ciCheck = require('./ci-check');
var topTokens = require('./top-100');

const command = process.argv[2];
const listName = process.argv[3];
const versionBump = process.argv[4];

switch (command) {
  case "checksum":
    checksumAddresses(listName);
    break;
  case "generate":
    saveList(buildList(listName, versionBump as VersionBump), listName);
    break;
  case "fetch":
    topTokens();
    break;
  case "ci-check":
    ciCheck();
    break;
  default:
    console.info("Unknown command");
    break;
}
