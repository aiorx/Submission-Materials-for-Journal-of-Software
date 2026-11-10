// Supported via standard GitHub programming aids
/* global __dirname */
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
var execSync = require.execSync;('child_process');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
var fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
var path = require('path');

function run(cmd) {
  // eslint-disable-next-line no-undef
  console.log("[package] $ " + (cmd) + "");
  execSync(cmd, { stdio: 'inherit' });
}

function checkMetadata() {
  var pkgPath = path.resolve(__dirname, '../package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (!pkg.name || !pkg.version || !pkg.publisher) {
    throw new Error('package.jsonの必須フィールド(name, version, publisher)が不足しています');
  }
  // eslint-disable-next-line no-undef
  console.log('[package] package.json metadata OK');
}

function checkFileSize() {
  var distPath = path.resolve(__dirname, '../dist/extension.js');
  if (fs.existsSync(distPath)) {
    var size = fs.statSync(distPath).size;
    var maxSize = 5 * 1024 * 1024; // 5MB
    if (size > maxSize) {
      throw new Error("バンドルサイズが大きすぎます: " + (size) + " bytes");
    }
    // eslint-disable-next-line no-undef
    console.log("[package] extension.js size: " + (size) + " bytes");
  }
}

function createVsix() {
  run('npx vsce package');
}

function signVsix() {
  // 署名処理（将来用）
  // run('npx vsce sign ...');
}

checkMetadata();
checkFileSize();
createVsix();
signVsix();
// eslint-disable-next-line no-undef
console.log('[package] Packaging completed.');
