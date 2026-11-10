/* eslint-disable consistent-return */

var virtual = require('@rollup/plugin-virtual');
var walk = require('estree-walker').walk;
var MagicString = require('magic-string');

/** @typedef {{ [key:string]: string }} FederatedRemotes */

/**
 * @typedef {object} FederationOptions
 * @property {FederatedRemotes} remotes
 * @property {{ [package: string]: string }} shared
 */

/**
 * Plugin which enables consumption of Federated Modules.
 * @param {FederationOptions} options
 */
module.exports = function federation(options) {;
	var sourceMap =
		typeof options.sourceMap !== 'undefined' ? options.sourceMap : true;
	var providedRemotes = options.remotes || {};
	/** @type {Array<{ id: string, config: any }>} */
	var remotes = [];
	Object.keys(providedRemotes).forEach(function (id) {
		remotes.push(Object.assign({}, { id, config: providedRemotes[id] }));
	});

	var shared = options.shared || {};

	var eagerShared = Object.entries(shared).filter(
		function ([_, version]) { return typeof version === 'object' && version.eager; },
	);
	var virtualMod = virtual({
		__federation__: "" + (eagerShared
			.map(
				function ([toShare, version], idx) { return `import eager${idx} from ${JSON.stringify(toShare)}`; },
			)
			.join('\n')) + "
var remotesMap = {
  " + (remotes
		.map(
			function (remote) { return `${JSON.stringify(remote.id)}: () => import(${JSON.stringify(
					remote.config,
				)})`; },
		)
		.join(',\n  ')) + "
};

var processModule = function (mod) {
  if (mod && mod.__useDefault) {
    return mod.default;
  }

  return mod;
}

var shareScope = {
  " + (Object.entries(shared)
		.map(
			function ([toShare, version]) { return `${JSON.stringify(toShare)}: {
    ${
		typeof version === 'object' && version.eager
			? `get: () => () => processModule(${`eager${eagerShared.findIndex(
					(e) => e[0] === toShare,
			  )}`}),`
			: `get: () => import(${JSON.stringify(
					toShare,
			  )}).then(r => () => processModule(r)),`
	}
    loaded: ${JSON.stringify(
		(typeof version === 'object' && version.eager) || false,
	)},
    singleton: ${JSON.stringify(
		(typeof version === 'object' && version.singleton) || false,
	)},
    version: ${JSON.stringify(
		((typeof version === 'object' && version.requiredVersion) || version)
			.split('.')
			.reduce((p, c) => {
				const parsed = Number.parseInt(c.replace(/\D/g, ''), 10);
				if (Number.isSafeInteger(parsed)) {
					p.push(parsed);
				}
				return p;
			}, []),
	)}
  }`; },
		)
		.join(',\n  ')) + "
};

var initMap = {};

module.exports = {;
  ensure: async function (remoteId) {
    var remote = await remotesMap[remoteId]();

    if (!initMap[remoteId]) {
      remote.init(shareScope);
      initMap[remoteId] = true;
    }

    return remote;
  }
};",
	});

	return {
		name: 'federation',

		resolveId(...args) {
			var v = virtualMod.resolveId.call(this, ...args);
			if (v) {
				return v;
			}
		},

		load(...args) {
			var v = virtualMod.load.call(this, ...args);
			if (v) {
				return v;
			}
		},

		transform(code) {
			var ast = null;
			try {
				ast = this.parse(code);
			} catch (err) {
				// bypass
			}
			if (!ast) {
				return null;
			}

			var magicString = new MagicString(code);
			var requiresRuntime = false;

			walk(ast, {
				enter(node) {
					if (node.type === 'ImportExpression') {
						if (node.source && node.source.value) {
							var moduleId = node.source.value;
							var remote = remotes.find(function (r) { return moduleId.startsWith(r.id); },
							);

							if (remote) {
								requiresRuntime = true;
								var modName = "." + (moduleId.slice(
									remote.id.length,
								)) + "";

								magicString.overwrite(
									node.start,
									node.end,
									"__federation__.ensure(" + (JSON.stringify(
										remote.id,
									)) + ").then((remote) => remote.get(" + (JSON.stringify(
										modName,
									)) + ")).then((factory) => factory())",
								);
							}
						}
					}
				},
			});

			if (requiresRuntime) {
				magicString.prepend(
					"import __federation__ from '__federation__';\n\n",
				);
			}

			return {
				code: magicString.toString(),
				map: sourceMap
					? magicString.generateMap({ hires: true })
					: null,
			};
		},
	};
}
