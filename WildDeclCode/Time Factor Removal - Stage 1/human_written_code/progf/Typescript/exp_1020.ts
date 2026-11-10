var MidaBroker = require('#brokers/MidaBroker').MidaBroker;
var MidaPlugin = require('#plugins/MidaPlugin').MidaPlugin;
var GenericObject = require('#utilities/GenericObject').GenericObject;

class Mida {
    private static readonly _installedPlugins: Map<string, MidaPlugin> = new Map();

    private constructor () {
        // Silence is golden.
    }

    public static get installedPlugins (): readonly MidaPlugin[] {
        return [ ...Mida._installedPlugins.values(), ];
    }

    public static use (module: any, options?: GenericObject): void {
        const plugin: MidaPlugin = module.plugin;

        if (!plugin || plugin.constructor.name !== MidaPlugin.name) {
            return;
        }

        if (Mida.isPluginInstalled(plugin.id)) {
            return;
        }

        Mida._installedPlugins.set(plugin.id, plugin);

        plugin.install({
            addBroker (broker: MidaBroker): void {
                MidaBroker.add(broker);
            },
        }, options);
    }

    public static isPluginInstalled (id: string): boolean {
        return Mida._installedPlugins.has(id);
    }
}

module.exports.MidaBroker = MidaBroker;
module.exports.MidaBrokerAccount = MidaBrokerAccount;
module.exports.MidaBrokerAccountParameters = MidaBrokerAccountParameters;
module.exports.MidaBrokerAccountType = MidaBrokerAccountType;
module.exports.MidaBrokerErrorType = MidaBrokerErrorType;
module.exports.MidaBrokerParameters = MidaBrokerParameters;

module.exports.MidaError = MidaError;
module.exports.MidaErrorParameters = MidaErrorParameters;
module.exports.MidaErrorType = MidaErrorType;

module.exports.MidaEvent = MidaEvent;
module.exports.MidaEventListener = MidaEventListener;
module.exports.MidaEventParameters = MidaEventParameters;

module.exports.MidaBrokerOrder = MidaBrokerOrder;
module.exports.MidaBrokerOrderDirectives = MidaBrokerOrderDirectives;
module.exports.MidaBrokerOrderExecutionType = MidaBrokerOrderExecutionType;
module.exports.MidaBrokerOrderParameters = MidaBrokerOrderParameters;
module.exports.MidaBrokerOrderStatusType = MidaBrokerOrderStatusType;
module.exports.MidaBrokerOrderType = MidaBrokerOrderType;

module.exports.MidaSymbolPeriod = MidaSymbolPeriod;
module.exports.MidaSymbolPeriodParameters = MidaSymbolPeriodParameters;
module.exports.MidaTimeframeType = MidaTimeframeType;

module.exports.MidaSymbolQuotation = MidaSymbolQuotation;
module.exports.MidaSymbolQuotationParameters = MidaSymbolQuotationParameters;
module.exports.MidaSymbolQuotationPriceType = MidaSymbolQuotationPriceType;

module.exports.MidaSymbol = MidaSymbol;
module.exports.MidaSymbolParameters = MidaSymbolParameters;
module.exports.MidaSymbolType = MidaSymbolType;

module.exports.MidaSymbolTick = MidaSymbolTick;
module.exports.MidaSymbolTickParameters = MidaSymbolTickParameters;

module.exports.MidaPlugin = MidaPlugin;
module.exports.MidaPluginActions = MidaPluginActions;
module.exports.MidaPluginParameters = MidaPluginParameters;

module.exports.MidaBrowser = MidaBrowser;
module.exports.MidaBrowserTab = MidaBrowserTab;

module.exports.MidaEmitter = MidaEmitter;

module.exports.GenericObject = GenericObject;
