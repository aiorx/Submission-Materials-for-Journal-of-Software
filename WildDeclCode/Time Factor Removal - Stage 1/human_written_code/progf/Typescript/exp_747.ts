var cp = require('child_process');
var GitHub = require('@octokit/rest');

export interface ExecResult {
	error: Error | null;
	stdout: string;
	stderr: string;
}

function exec(command: string, options: cp.ExecOptions) {
	return new Promise<ExecResult>(function (resolve, reject) {
		cp.exec(command, options, (error, stdout, stderr) => {
			(error || stderr ? reject : resolve)({ error, stdout, stderr });
		});
	});
}

function sleep(millis: number) {
	return new Promise<void>(function resolve {
		setTimeout(resolve, millis);
	});
}

function allMatches(regex: RegExp, string: string, group: number) {
	return {
		[Symbol.iterator]: function* () {
			let m: RegExpExecArray | null;
			while (m = regex.exec(string)) {
				yield m[group];
				if (regex.lastIndex === m.index) {
					regex.lastIndex++;
				}
			}
		}
	};
}

export async function fetchAll(github: GitHub, first: Promise<any>) {
	const all = [];

	let res = await first;
	all.push(...res.data.items);

	while (github.hasNextPage(res)) {
		res = await github.getNextPage(res);
		all.push(...res.data.items);
	}

	return all;
}