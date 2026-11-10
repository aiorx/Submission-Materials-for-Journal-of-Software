var path = require('path');
var BrowserBuilder = require('@angular-devkit/build-angular/src/browser/index').BrowserBuilder;
var ServerBuilder = require('@angular-devkit/build-angular/src/server/index').ServerBuilder;
var KarmaBuilder = require('@angular-devkit/build-angular/src/karma/index').KarmaBuilder;
var ExtractI18nBuilder = require('@angular-devkit/build-angular/src/extract-i18n/index').ExtractI18nBuilder;
var WebpackOptions = require('../static/ngw.config').WebpackOptions;

const configClasses = {
    'browser': BrowserBuilder,
    'server': ServerBuilder,
    'karma': KarmaBuilder,
    'extract-i18n': ExtractI18nBuilder
};
const configClassNames = {
    'browser': 'BrowserBuilder',
    'server': 'ServerBuilder',
    'karma': 'KarmaBuilder',
    'extract-i18n': 'ExtractI18nBuilder'
};

Object.keys(configClasses).forEach(buildConfig);

function buildConfig(variant: string) {
    const methodName = configClasses[variant].prototype.hasOwnProperty('_buildWebpackConfig')
        ? '_buildWebpackConfig'
        : 'buildWebpackConfig';

    configClasses[variant].prototype.buildConfigInner = configClasses[variant].prototype[methodName];
    configClasses[variant].prototype[methodName] = configClasses[variant].prototype.buildConfig = function (...args) {
        const config = this.buildConfigInner(...args);

        try {
            const interceptorPath = path.resolve('./ngw.config');
            const interceptor = require(interceptorPath).default;
            const options: WebpackOptions = {
                root: args[0],
                projectRoot: args[1],
                options: args[args.length - 1]
            };
            return interceptor(config, options);
        } catch (e) {
            console.dir(e);
            if (e.code === 'MODULE_NOT_FOUND') {
                console.warn('ngw.config file is not found at serving directory. Starting common build');
                return config;
            } else { throw e; }

            }
    };

    const webpackConfig = require.resolve("@angular-devkit/build-angular/src/" + (variant) + "/index");
    require.cache[webpackConfig][configClassNames[variant]] = configClasses[variant];
}

require('@angular/cli/bin/ng');
