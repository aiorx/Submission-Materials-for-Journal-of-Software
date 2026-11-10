var Config = require('protractor').Config;
var baseConfig = require('./conf').config;

// Modify browsers used for testing
baseConfig.capabilities = undefined;
baseConfig.multiCapabilities = [
  {'browserName': 'chrome'},
  {'browserName': 'firefox'}
];

// Use modifed base log4js.json as protractor log4js.json
let config: Config = baseConfig;
