var resolve = require('path').resolve;
var basename = require('path').basename;
var fs = require('fs');
var os = require('os');
var parseEnv = require('parse-dotenv');
var globby = require('globby');
var pkgConf = require('pkg-conf');

const DEFAULT_ENV_PATH = resolve(process.cwd(), ".env");
const DEFAULT_SAMPLE_ENV = resolve(process.cwd(), ".env.example");

interface EnvObject {
	[key: string]: any;
}

interface Config {
	preserve?: [string];
	emptyLines?: boolean;
	comments?: boolean;
}

const fileExists = function (path: string) { return fs.existsSync(path); };

const getObjKeys = function (obj: object) { return Object.keys(obj); };

const envToString = function (parsed: EnvObject) { return getObjKeys(parsed)
		.map(key => "" + (key) + "=" + (parsed[key] || "") + "")
		.join(os.EOL)
		.replace(/(__\w+_\d+__=)/g, ""); };

const writeToSampleEnv = function (path: string, parsedEnv: object) {
	try {
		fs.writeFileSync(path, envToString(parsedEnv));
	} catch (e) {
		throw new Error("Sync failed. " + (e.message) + "");
	}
};

const emptyObjProps = function (obj: EnvObject) {
	const objCopy = { ...obj };
	Object.keys(objCopy).forEach(key => {
		if (objCopy[key].includes("#")) {
			if (objCopy[key].match(/(".*"|'.*')/g)) {
				const objArr = objCopy[key].split(/(".*"|'.*')/);
				objCopy[key] = objArr.slice(-1)[0].trim();
			} else {
				const objArr = objCopy[key].split("#");
				objCopy[key] = "#" + (objArr.slice(-1)[0]) + "";
			}

			return;
		}

		/* istanbul ignore else */
		if (!key.startsWith("__COMMENT_")) {
			objCopy[key] = "";
		}
	});

	return objCopy;
};

const getUniqueVarsFromEnvs = async function (
	env: EnvObject,
	envExample: EnvObject,
	config: Config = {}
) {
	let ignoreKeys = config.preserve || [];

	const uniqueKeys = new Set(getObjKeys(env));
	const uniqueKeysArray: Array<string> = Array.from(uniqueKeys);

	let uniqueFromSource = uniqueKeysArray.map((key: string) => {
		if (key.startsWith("__COMMENT_")) return { [key]: env[key] };
		return { [key]: envExample[key] || "" };
	});

	let presevedVars = getObjKeys(envExample)
		.map(key => ({ [key]: envExample[key] }))
		.filter(env => {
			return ignoreKeys.length && ignoreKeys.includes(getObjKeys(env)[0]);
		});

	return [...uniqueFromSource, ...presevedVars];
};

const syncWithSampleEnv = async function (
	envPath: string,
	envExamplePath: string,
	initialConfig?: Config
) {
	// We do this so we can pass it via test as well
	let config: Config = initialConfig || (await pkgConf("sync-dotenv")) as any;

	// Set defaults
	config.comments = typeof config.comments === 'undefined' ? true : config.comments;
	config.emptyLines = typeof config.emptyLines === 'undefined' ? true : config.comments;

	let sourceEnv = emptyObjProps(
		parseEnv(envPath, { emptyLines: !!config.emptyLines, comments: !!config.comments })
	);
	let targetEnv = parseEnv(envExamplePath);

	const uniqueVars = await getUniqueVarsFromEnvs(sourceEnv, targetEnv, config);
	let envCopy: EnvObject = {};
	uniqueVars.forEach(env => {
		let [key] = getObjKeys(env);
		envCopy[key] = env[key];
	});

	writeToSampleEnv(envExamplePath, envCopy);
};

const exit = function (message: string, code: number = 1) { return Promise.reject({ message, code }); };

const syncEnv = async (
	sampleEnv?: string,
	source?: string,
	samples?: string
): Promise<{ msg: string; code: number } | string> => {
	if (sampleEnv && (sampleEnv === ".env" || basename(sampleEnv) === ".env"))
		return exit("Cannot sync .env with .env");

	const SAMPLE_ENV_PATHS: string[] = !samples
		? [resolve(process.cwd(), sampleEnv || DEFAULT_SAMPLE_ENV)]
		: globby
			.sync(samples)
			.map(function (sample: string) { return resolve(process.cwd(), sample); });

	let envPath = source
		? fileExists(source)
			? source
			: null
		: DEFAULT_ENV_PATH;

	if (envPath === null) return exit("" + (source) + " not found");

	if (!source && !fileExists(envPath)) return exit(".env doesn't exists");

	if (!SAMPLE_ENV_PATHS.length)
		return exit("" + (samples) + " did not match any file");

	if (!fileExists(SAMPLE_ENV_PATHS[0]))
		return exit("" + (sampleEnv || basename(DEFAULT_SAMPLE_ENV)) + " not found");

	const sourcePath = envPath;

	for (let samplePath of SAMPLE_ENV_PATHS) {
		await syncWithSampleEnv(sourcePath, samplePath);
	}

	return Promise.resolve(SAMPLE_ENV_PATHS.join(" "));
};
