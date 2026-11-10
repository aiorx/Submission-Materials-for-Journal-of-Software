var reload = require('./app').reload;

reload();

if (module.hot) {
	module.hot.accept("./app", function () { return reload(); });
}
