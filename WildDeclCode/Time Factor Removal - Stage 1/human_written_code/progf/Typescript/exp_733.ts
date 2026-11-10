/*---------------------------------------------------------------------------------------------
 *  This code is based on the askpass implementation in the Microsoft Visual Studio Code Git Extension
 *  https://github.com/microsoft/vscode/blob/473af338e1bd9ad4d9853933da1cd9d5d9e07dc9/extensions/git/src/askpass-main.ts,
 *  which has the following copyright notice & license:
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See ./licenses/LICENSE_MICROSOFT for license information.
 *--------------------------------------------------------------------------------------------*/

var fs = require('fs');
var http = require('http');

function fatal(err: any): void {
	console.error('Missing or invalid credentials.');
	console.error(err);
	process.exit(1);
}

function main(argv: string[]): void {
	if (argv.length !== 5) return fatal('Wrong number of arguments');
	if (!process.env['VSCODE_GIT_GRAPH_ASKPASS_HANDLE']) return fatal('Missing handle');
	if (!process.env['VSCODE_GIT_GRAPH_ASKPASS_PIPE']) return fatal('Missing pipe');

	var output = process.env['VSCODE_GIT_GRAPH_ASKPASS_PIPE']!;
	var socketPath = process.env['VSCODE_GIT_GRAPH_ASKPASS_HANDLE']!;

	var req = http.request({ socketPath, path: '/', method: 'POST' }, function res {
		if (res.statusCode !== 200) return fatal('Bad status code: ' + res.statusCode);

		var resData = '';
		res.setEncoding('utf8');
		res.on('data', (d) => resData += d);
		res.on('end', () => {
			try {
				var response = JSON.parse(resData);
				fs.writeFileSync(output, response + '\n');
			} catch (err) {
				return fatal('Error parsing response');
			}
			setTimeout(() => process.exit(0), 0);
		});
	});

	req.on('error', function () { return fatal('Error in request'); });
	req.write(JSON.stringify({ request: argv[2], host: argv[4].substring(1, argv[4].length - 2) }));
	req.end();
}

main(process.argv);
