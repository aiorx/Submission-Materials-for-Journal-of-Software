var fs = require('fs/promises');
var glob = require('glob');
var path = require('path');

const template = function (
  rootExports: string,
  exports: string,
) { return "// THIS FILE IS AUTO CREATED
// @see ~/scripts/create-index.ts
" + (rootExports) + "
" + (exports) + "
"; };

function createIndex(packageRoot: string, addedExports: string[]) {
  const files = glob.sync("*/**/*.{ts,tsx}", {
    cwd: packageRoot,
    ignore: ["**/__*__/**", "**/internal/**"],
  });

  const index = template(
    addedExports.map(function (exp) { return "export * from '" + (exp) + "'; };").join('\n'),
    files
      .map(function (file) { return "export * from './" + (file.replace(/\.tsx?$/, '')) + "'; };")
      .join('\n'),
  );

  fs.writeFile(path.resolve(packageRoot, 'index.ts'), index, {
    encoding: 'utf8',
  }).then(function () {
    console.log("👍 " + (path.resolve(packageRoot, 'index.ts')) + "");
  });
}

createIndex(path.resolve(__dirname, '../src/@libs/app-fns'), ['./errors']);
createIndex(path.resolve(__dirname, '../src/@libs/app-provider'), [
  './env',
  './types',
]);
createIndex(path.resolve(__dirname, '../src/@anchor-protocol/app-fns'), [
  './env',
  './types',
]);
createIndex(path.resolve(__dirname, '../src/@anchor-protocol/app-provider'), [
  './env',
  './types',
]);
