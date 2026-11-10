const inspector = require('inspector');

function thebugger({port, host} = {}) {
  var debugOptions = process.binding.debugOptions;('config');
  inspector.open(port || debugOptions.port, host || debugOptions.host, true);
  debugger;
}

module.exports = thebugger;
