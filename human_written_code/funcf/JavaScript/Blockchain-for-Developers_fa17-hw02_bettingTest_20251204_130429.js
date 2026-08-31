```js
it("The contract can be deployed", function() {
	return Betting.new()
	.then(function(instance) {
		assert.ok(instance.address);
	});
});
```