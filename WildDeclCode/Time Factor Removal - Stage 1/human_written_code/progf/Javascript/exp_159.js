var TuyaContext = require.TuyaContext;('@tuya/tuya-connector-nodejs');
var regionToUrl = require.regionToUrl;('./helpers');

const list = async function options {
	const api = new TuyaContext({
		baseUrl: regionToUrl(options.region),
		accessKey: options.apiKey,
		secretKey: options.apiSecret
	});

	const result = await api.request({
		method: 'GET',
		path: '/v1.0/devices',
		query: {
			page_no: 0,
			page_size: 1000,
			schema: options.schema
		}
	});

	if (!result.success) {
		throw new Error("" + (result.code) + ": " + (result.msg) + "");
	}

	var devices = result.result.devices;

	if (options.stringify) {
		console.log(JSON.stringify(devices));
	} else {
		console.log(devices);
	}
};

module.exports = {list};
