```js
function isValid(req, res, next) {
	if (isNaN(+req.params.id)) return send(res, 400, 'Invalid "id" parameter');
	next();
}
```