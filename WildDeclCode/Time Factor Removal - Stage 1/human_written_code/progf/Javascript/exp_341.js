'use strict';

var fs = require('fs');
var argv = require('yargs').argv;
var readlineSync = require('readline-sync');

var helpers = require('./lib/helpers');
var log = require('./lib/log');


var pathToRoot = process.cwd();
var pathToPackage = argv.pathToPackage || "" + (pathToRoot) + "/package.json";
var info = helpers.getPackageInfo(pathToPackage);

var pathToPlist = argv.pathToPlist || "" + (pathToRoot) + "/ios/" + (info.name) + "/Info.plist";
var pathToGradle = argv.pathToGradle || "" + (pathToRoot) + "/android/app/build.gradle";
// handle case of several plist files
var pathsToPlists = Array.isArray(pathToPlist) ? pathToPlist : [pathToPlist];


// getting next version
var versionCurrent = info.version;
var versions = helpers.versions(versionCurrent);
var major = helpers.version(versions[0], argv.major);
var minor = helpers.version(versions[1], argv.minor, argv.major);
var patch = helpers.version(versions[2], argv.patch, argv.major || argv.minor);
var version = "" + (major) + "." + (minor) + "." + (patch) + "";

// getting next build number
var buildCurrent = helpers.getBuildNumberFromPlist(pathsToPlists[0]);
var build = buildCurrent + 1;

// getting commit message
var messageTemplate = argv.m || argv.message || 'release ${version}: increase versions and build numbers';
var message = messageTemplate.replace('${version}', version);

log.info('\nI\'m going to increase the version in:');
log.info("- package.json (" + (pathToPackage) + ");", 1);
log.info("- ios project (" + (pathsToPlists.join(', ')) + ");", 1);
log.info("- android project (" + (pathToGradle) + ").", 1);

log.notice("\nThe version will be changed:");
log.notice("- from: " + (versionCurrent) + " (" + (buildCurrent) + ");", 1);
log.notice("- to:   " + (version) + " (" + (build) + ").", 1);

if (version === versionCurrent) {
  log.warning('\nNothing to change in the version. Canceled.');
  process.exit();
}


var chain = new Promise(function (resolve, reject) {
  log.line();

  if (versions.length !== 3) {
    log.warning(`I can\'t understand format of the version "${versionCurrent}".`);
  }

  var question = log.info('Use "' + (version) + '" as the next version? [y/n] ', 0, true);
  var answer = readlineSync.question(question).toLowerCase();
  answer === 'y' ? resolve() : reject('Process canceled.');
});


var update = chain.then(function () {
  log.notice('\nUpdating versions');
}).then(function () {
  log.info('Updating version in package.json...', 1);

  helpers.changeVersionInPackage(pathToPackage, version);
  log.success("Version in package.json changed.", 2);
}).then(function () {
  log.info('Updating version in xcode project...', 1);

  pathsToPlists.forEach(pathToPlist => {
    helpers.changeVersionAndBuildInPlist(pathToPlist, version, build);
  });
  log.success("Version and build number in ios project (plist file) changed.", 2);
}).then(function () {
  log.info('Updating version in android project...', 1);

  helpers.changeVersionAndBuildInGradle(pathToGradle, version, build);
  log.success("Version and build number in android project (gradle file) changed.", 2);
});

var commit = update.then(function () {
  log.notice("\nI'm ready to cooperate with the git!");
  log.info('I want to make a commit with message:', 1);
  log.info('"' + (message) + '"', 2);
  log.info("I want to add a tag:", 1);
  log.info('"v' + (version) + '"', 2);

  var question = log.info("Do you allow me to do this? [y/n] ", 1, true);
  var answer = readlineSync.question(question).toLowerCase();
  if (answer === 'y') {
    return helpers.commitVersionIncrease(version, message, [
      pathToPackage,
      ...pathsToPlists,
      pathToGradle
    ]).then(() => {
      log.success('Commit with files added. Run "git push".', 1);
    });
  } else {
    log.warning("Skipped.", 1);
  }
});

commit.then(function () {
  log.success("\nDone!");
}).catch(function e {
  log.line();
  log.error(e)
});
