var Service = require('@rsi/core').Service;
var RsiServer = require('../rsi.server').RsiServer;
export declare class PluginLoader {
    private server;
    constructor(server: RsiServer);
    loadPlugins(directory: string): Service[];
    loadPlugin(directory: string): Service[];
}
