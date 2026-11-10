// Assisted using common GitHub development utilities
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var vi = require('vitest').vi;
var loadGridConfig = require('../config/configLoader').loadGridConfig;
var configData = require('../config/grid-config.json');

describe('configLoader', function () {
    it('should load configuration from local json file', () => {
        var config = loadGridConfig();
        expect(config).toEqual(configData);
    });

    it('should validate configuration values', () => {
        var config = loadGridConfig();
        expect(
            config.minWidth >= 2 &&
            config.maxWidth >= config.minWidth &&
            config.minHeight >= 2 &&
            config.maxHeight >= config.minHeight
        ).toBe(true);
    });
});