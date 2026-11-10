'use strict';

var Message = require('./spec/message').Message;
var Runner = require('./runner').Runner;
var TestResult = require('./runner').TestResult;
var getRunners = require('./multi_runner').getRunners;
var Client = require('./clients/client_interface').Client;
var Config = require('./config').Config;
var defaultConfig = require('./config').defaultConfig;
var ClientType = require('./config').ClientType;
var Translator = require('./translator').Translator;

var jsYaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var program = require('commander');
var chalk = require('chalk');
var findParentDir = require('find-parent-dir');
var semver = require('semver');
require('source-map-support/register');

process.on('unhandledRejection', function (error) {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message);
});

var chatPath: string = null;

program
  .version('0.1.0')
  .description('autobot is an multi-platform bot testing framework. ' +
    'It requires an autobot.yml config file to be in the working directory or a parent.')
  .option('-v --verbose', 'Enable full logging including bot queries and responses')
  .option('-j --json', 'Enable seeing the direct JSON responses from the client')
  .option('-c, --config <autobot.yml>', 'autobot.yml config file to use ' + 
    '(default current directory and parents)')
  .option('-np, --no-parallel', 'Disables parallelism')
  .option(
     '-d --dom <dom>',
     'DirectLine endpoint to use, alternative to https://directline.botframework.com/',
   )
  .arguments('<chatPath>')
  .action(function (chatPathVal) {
    chatPath = chatPathVal;
  })
  .parse(process.argv);

if (chatPath === null) {
  chatPath = './';
}

var configPath;
if (program.config) {
  configPath = program.config;
} else {
  configPath = path.join(
    process.cwd(),
    'autobot.yml');
}

if (!fs.existsSync(configPath)) {
  if (program.configPath) {
    console.log(chalk.red("Cannot find file " + (configPath) + ""));
  } else {
    program.outputHelp();
    console.log(
      chalk.red(
        '\nYou must have an autobot.yml config file ' +
        'in this directory or in a parent directory\n'));
    process.exit(1);
  }
}

var config: Config = Object.assign(
  {},
  defaultConfig,
  jsYaml.safeLoad(fs.readFileSync(configPath, 'utf8')));

if (config.localeFiles) {
  if (typeof config.localeFiles === 'string') {
    config.localeFiles = [config.localeFiles];
  }
  Translator.loadTranslation(
    config.localeFiles
      .map(function localePath { return path.join(path.dirname(configPath), localePath); }),
    config.client === ClientType.BotFramework);
}

console.log('');
async function run() {
  var runners = getRunners(chatPath, config);
  var success;

  var finalResults: TestResult[];
  var start;
  try {
    start = new Date().getTime();
    console.log(chalk.green("\n\tDiscovered " + (runners.length) + " tests "));
                // `(${runner.userMetadata.size} branches)\n`);
    runners.forEach(function r { return r.progressBar && r.progressBar.update(0); });
    var results = await Promise.all(runners.map(function runner { return runner.start(() => {
    }); }));
    finalResults = results.map(function r { return r[0]; });
    finalResults.forEach(function (result) {
      var chalkFn = result.passed ? chalk.green : chalk.red;
      console.log(
        chalkFn("\t" + (result.passed ? '✓' : '✗') + " " + (result.dialogue.title) + "" +
          ": " + (result.passed ? 'Passed' : 'Failed') + ""));
    });
    success = !finalResults.some(function result { return !result.passed; });
  } catch (err) {
    console.log(chalk.red(err));
  }

  console.log('');

  finalResults.filter(function result { return !result.passed; }).forEach(function (failedResult) {
    console.log(chalk.red("\t" + (failedResult.dialogue.title) + ""));
    console.log("" + (failedResult.errorMessage) + "\n");
  });

  var nSuccess = finalResults.filter(function result { return result.passed; }).length;
  var nFailures = finalResults.length - nSuccess;
  if (nSuccess > 0) {
    console.log(chalk.green("\t" + (nSuccess) + " tests passed"));
  }
  if (nFailures > 0) {
    console.log(chalk.red("\t" + (nFailures) + " tests failed"));
  }
  console.log("\tTests took " + (Math.round(new Date().getTime() - start)) + " ms\n\n");
  if (success) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}
run().catch(function (err) {
  console.error(err);
});
