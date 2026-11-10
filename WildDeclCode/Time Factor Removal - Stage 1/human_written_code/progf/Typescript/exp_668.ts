'use strict';

var fs = require('fs');
var path = require('path');
var net = require('net');
var child_process = require('child_process');

var extensions = require('vscode').extensions;
var workspace = require('vscode').workspace;
var Disposable = require('vscode').Disposable;
var ExtensionContext = require('vscode').ExtensionContext;
var LanguageClient = require('vscode-languageclient').LanguageClient;
var LanguageClientOptions = require('vscode-languageclient').LanguageClientOptions;
var SettingMonitor = require('vscode-languageclient').SettingMonitor;
var StreamInfo = require('vscode-languageclient').StreamInfo;

function activate(context: ExtensionContext) {

	function discoverExtensionPaths() {
		return extensions.all
			.filter(function x { return x.id.startsWith("adamvoss.vscode-languagetool-"); })
			.map(function x { return x.extensionPath; })
	}

	function buildDesiredClasspath() {
		var isWindows = process.platform === 'win32';

		var joinCharacter = isWindows ? ';' : ':'

		var additionalPaths = discoverExtensionPaths()
			.map(function p { return path.resolve(context.extensionPath, '..', p, 'lib', '*'); })
			.join(joinCharacter);

		var desiredClasspath = path.join('lib', '*');
		if (additionalPaths) {
			desiredClasspath += joinCharacter + additionalPaths
		}
		return desiredClasspath
	}

	function setClasspath(text: String, desiredClasspath: String): String {
		var classpathRegexp = /^((?:set )?CLASSPATH=[%$]APP_HOME%?[\\\/])(.*)$/m

		return text.replace(classpathRegexp, "$1" + (desiredClasspath) + "")
	}

	function createServer(): Promise<StreamInfo> {
		return new Promise(function (resolve, reject) {
			var server = net.createServer((socket) => {
				console.log("Creating server");

				resolve({
					reader: socket,
					writer: socket
				});

				socket.on('end', () => console.log("Disconnected"));
			}).on('error', (err) => {
				// handle errors here
				throw err;
			});

			var isWindows = process.platform === 'win32';

			// grab a random port.
			server.listen(() => {
				// Start the child java process
				var options = { cwd: workspace.rootPath };

				var scriptDir = path.resolve(context.extensionPath, 'lib', 'languagetool-languageserver', 'build', 'install', 'languagetool-languageserver', 'bin')
				var originalScript = path.resolve(scriptDir, isWindows ? 'languagetool-languageserver.bat' : 'languagetool-languageserver')
				var newScript = path.resolve(scriptDir, isWindows ? 'languagetool-languageserver-live.bat' : 'languagetool-languageserver-live')

				var scriptText = fs.readFileSync(originalScript, "utf8")
				var newText = setClasspath(scriptText, buildDesiredClasspath())
				fs.writeFileSync(newScript, newText, { mode: 0o777 })

				var process = child_process.spawn(newScript, [server.address().port.toString()], options);

				// Send raw output to a file
				if (context.storagePath) {
					if (!fs.existsSync(context.storagePath)) {
						console.log(context.storagePath);
						fs.mkdirSync(context.storagePath);
					}

					var logFile = context.storagePath + '/vscode-languagetool-languageserver.log';
					var logStream = fs.createWriteStream(logFile, { flags: 'w' });

					process.stdout.pipe(logStream);
					process.stderr.pipe(logStream);

					console.log("Storing log in '" + (logFile) + "'");
				}
				else {
					console.log("No storagePath, languagetool-languageserver logging disabled.");
				}
			});
		});
	};

	// Options to control the language client
	var clientOptions: LanguageClientOptions = {
		documentSelector: ['plaintext', 'markdown'],
		synchronize: {
			configurationSection: 'languageTool'
		}
	}

	// Allow to enable languageTool in specific workspaces
	var config = workspace.getConfiguration('languageTool');

	if (config['enabled']) {
		// Create the language client and start the client.
		var disposable = new LanguageClient('languageTool', 'LanguageTool Client', createServer, clientOptions).start();

		// Push the disposable to the context's subscriptions so that the 
		// client can be deactivated on extension deactivation
		context.subscriptions.push(disposable);
	}
}