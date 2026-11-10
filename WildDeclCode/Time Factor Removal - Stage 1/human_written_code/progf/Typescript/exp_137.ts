var LernaPackagesPlugin = require('./plugin').LernaPackagesPlugin;
var PluginHost = require('typedoc/dist/lib/utils').PluginHost;
var ParameterType = require('typedoc').ParameterType;

function load(PluginHost: PluginHost) {
    const app = PluginHost.owner;

    app.options.addDeclaration({
        name: 'lernaExclude',
        help: 'List of package names that should be excluded.',
        type: ParameterType.Array
    });

    app.options.addDeclaration({
        name: 'pathExclude',
        help: 'List of paths to entirely ignore',
        type: ParameterType.Array,
        defaultValue: []
    });

    app.converter.addComponent('lerna-packages', LernaPackagesPlugin);
}
