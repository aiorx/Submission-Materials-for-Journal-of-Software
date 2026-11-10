var glob = require('glob');
var promisify = require('util').promisify;
var fse = require('fs-extra');

execute()
  .then(function () { return process.exit(); })
  .catch(function err {
    console.error(err);
    process.exit(1);
  });

async function execute() {
  const files = await promisify(glob)("../Bibel/**/*.md");
  await Promise.all(
    files.map(convertFile)
  );
}

async function convertFile(path: string) {
  const newContent = (await fse.readFile(path, 'utf8'))
    .replace(/(^|\n)#+ ?/g, '$1')                               // Convert headings
    .replace(/(^|\n)__(\d+)__/g, '$1Kapitel $2')                // Convert chapter numbers
    .replace(/<sup>(\d+)<\/sup>/ig, '$1 ')                      // Convert verse numbers
    .replace(/<sup title="([^"]+)">&#x2732;<\/sup>/g, ' {$1}')  // Convert footnotes
    .replace(/_(.*?)_/g, '$1')                                  // Remove italic styling
    .replace(/__(.*?)__/g, '$1');                               // Remove bold styling
  const newPath = path
    .replace('/Bibel/', '/Bibel.txt/')
    .replace(/\.md$/, '.txt');
  await fse.ensureFile(newPath);
  await fse.writeFile(newPath, newContent, 'utf8');
}
