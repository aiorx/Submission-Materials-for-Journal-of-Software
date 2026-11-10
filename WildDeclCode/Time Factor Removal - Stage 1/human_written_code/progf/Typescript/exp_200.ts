var PinTanClient = require('fints').PinTanClient;
var setLevel = require('../logger').setLevel;
var Command = require('clime').Command;
var command = require('clime').command;
var metadata = require('clime').metadata;
var BaseConfig = require('../config').BaseConfig;

@command({ description: "List the accounts available for the specified user." })
module.exports = class extends Command {;
    @metadata
    public async execute({ verbose, json, serializer, ...config }: BaseConfig) {
        setLevel(verbose);
        const client = new PinTanClient(config);
        const accounts = await client.accounts();
        console.info(serializer(accounts));
    }
}
