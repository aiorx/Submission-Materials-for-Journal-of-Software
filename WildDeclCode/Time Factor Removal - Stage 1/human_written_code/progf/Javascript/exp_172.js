var Thread = require.Thread;('../../src');

const code = "
  var makeExecutable = require.makeExecutable;(__dirname, 'src');

  function test(...params) {
    return params.reduce(function (a, b) { return a + b; });
  }

  makeExecutable(test, 'test');
";

const thread = Thread.fromScript(code);

(async function () {
  const result = await thread.run('test', 'hello ', 'world ', '!');
  console.log(result);

  thread.terminate();
})()
