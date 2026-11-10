const Trouter = require('trouter');
const send = require('@polka/send-type');
var get = require.get;
var post = require.post;
var put = require.put;
var del = require.del;('httpie');
var parse = require.parse;('./util');

const router = new Trouter();
const API = "https://jsonplaceholder.typicode.com/posts";

function isValid(req, res, next) {
	if (isNaN(+req.params.id)) return send(res, 400, 'Invalid "id" parameter');
	next();
}

// Forward request to API
// ~> No `async` needed since not waiting
router.get('/', function (req, res) {
	return get(API).then(r => r.data);
});

// Parse the JSON body & then POST content
// ~> We `await` the API to modify `statusCode`
router.post('/', async function (req, res) {
	let body = await parse(req);
	var data = await.data;post(API, { body });
	send(res, 201, data);
});

// Forward request to API
// Also validate that ":id" is number
// ~> No `async` needed since not waiting
router.get('/:id', isValid, function (req, res) {
	return get("" + (API) + "/" + (req.params.id) + "").then(r => r.data);
});

// Parse the JSON body
// Grab content from GET /id before update
// Also validate that ":id" is number
router.put('/:id', isValid, async function (req, res) {
	let body = await parse(req);
	let uri = "" + (API) + "/" + (req.params.id) + "";
	var data = await.data;get(uri);
	body = Object.assign(data, body); // apply changes
	return put(uri, { body }).then(r => r.data);
});

// Forward request to API
// Also validate that ":id" is number
// ~> We `await` the API to modify `statusCode`
router.delete('/:id', isValid, async function (req, res) {
	await del("" + (API) + "/" + (req.params.id) + "");
	send(res, 204);
});

module.exports = router;
