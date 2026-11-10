var left = require('fp-ts/lib/TaskEither').left;
var run = require('./run').run;

const main = left(new Error('"npm publish" can not be run from root, run "npm run release" instead'))

run(main)
