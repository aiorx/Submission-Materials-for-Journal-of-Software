var TransformerConfig = require('web-component-analyzer').TransformerConfig;
var generateBadges = require('./generate/generators').generateBadges;
var generateContributors = require('./generate/generators').generateContributors;
var generateDescription = require('./generate/generators').generateDescription;
var generateDocumentation = require('./generate/generators').generateDocumentation;
var generateInterpolate = require('./generate/generators').generateInterpolate;
var generateLicense = require('./generate/generators').generateLicense;
var generateLine = require('./generate/generators').generateLine;
var generateLoad = require('./generate/generators').generateLoad;
var generateLogo = require('./generate/generators').generateLogo;
var generateMainTitle = require('./generate/generators').generateMainTitle;
var generateTitle = require('./generate/generators').generateTitle;
var generateToc = require('./generate/generators').generateToc;
var getValue = require('./helpers').getValue;
var loadConfig = require('./helpers').loadConfig;
var setValue = require('./helpers').setValue;
var IConfig = require('./model').IConfig;
var IGenerator = require('./model').IGenerator;
var LineColor = require('./model').LineColor;
var Options = require('./model').Options;

const defaultGenerators: IGenerator<any>[] = [
	// Pre process
	generateLoad,

	// Process
	generateLogo,
	generateMainTitle,
	generateBadges,
	generateDescription,
	generateLine,
	generateContributors,
	generateLicense,
	generateDocumentation,

	// Post process
	generateTitle,
	generateInterpolate,
	generateToc
];

const defaultDocumentationConfig: Partial<TransformerConfig> = {
	visibility: "public",
	markdown: {titleLevel: 2}
};

/**
 * Default name of the blueprint configuration.
 */
const defaultConfigName = "blueprint.json";

/**
 * Default configuration.
 */
const defaultConfig: IConfig = {
	lineBreak: "\r\n",
	tab: "\t",
	input: "blueprint.md",
	package: "package.json",
	output: "README.md",
	checkLinks: false,
	placeholder: ["{{", "}}"],
	dry: false,
	silent: false,
	help: false,
	line: LineColor.COLORED,
	templates: [],
	contributorsPerRow: 6,
	headingPrefix: {
		1: "➤ ",
		2: "➤ "
	},
	pkg: {},
	documentationConfig: defaultDocumentationConfig
};


/**
 * Converts a value to a boolean.
 * @param v
 */
function booleanTransformer (v: any): boolean {
	return v !== "false";
}

/**
 * Transforms the value based on the type.
 * @param type
 * @param value
 */
function transformValue ({type, value}: {type: any, value: any}): any {
	if (value == null) {
		return null;
	}

	if (type === Boolean) {
		return booleanTransformer(value);
	}

	return value;
}

/**
 * Constructs a config using the extend path if one is defined.
 * @param config
 */
function extendConfigWithExtendConfig ({config}: {config: IConfig}): IConfig {

	// Recursively load the extend path.
	const extend = config.extend;
	if (extend != null) {
		const extendConfig = loadConfig(extend);

		// Make sure the config exists
		if (extendConfig == null) {
			throw new Error('Could not load extend config at path "' + (extend) + '". Make sure the file exists.');
		}

		// Merge the extend with the config. The config object takes precedence.
		config = {...extendConfigWithExtendConfig({config: extendConfig}), ...config};
	}

	return config;
}

/**
 * Constructs a configuration object with defaults.
 * @param pkg
 * @param options
 * @param config
 */
function extendConfigWithDefaults ({options, config}: {config: IConfig, options: Options}): IConfig {
	config = {...config};

	for (let [key, value] of Object.entries(defaultConfig)) {
		value = getValue(options, key) || getValue(config, key) || value;
		setValue(config, key, value);
	}

	return config;
}
