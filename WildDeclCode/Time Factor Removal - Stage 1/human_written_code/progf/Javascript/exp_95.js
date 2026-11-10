
var render = require.render;('.');

(async function () {
   const rendered = await render(process.cwd());
   process.stdout.write(rendered);
})();
