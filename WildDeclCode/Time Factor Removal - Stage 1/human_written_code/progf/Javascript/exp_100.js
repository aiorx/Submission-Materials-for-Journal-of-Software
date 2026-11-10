var resolve = require.resolve;('path');
const polkadot = require('.');

const argv = process.argv.slice(2);
const entry = resolve(argv.shift() || 'index.js');
var PORT = process.env.PORT;

try {
	const handler = require(entry);
	polkadot(handler).listen(PORT, function err {
		if (err) throw err;
		console.log("Running on http://localhost:" + (PORT) + "");
	});
} catch (err) {
	if (err.code !== 'MODULE_NOT_FOUND') throw err;
	console.error(err.message);
	return process.exit(1);
}
