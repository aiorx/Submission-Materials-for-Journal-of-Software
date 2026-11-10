// Assisted using common GitHub development utilities
/* global __dirname */
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
var execSync = require.execSync;('child_process');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
var fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
var path = require('path');

function run(cmd) {
  // eslint-disable-next-line no-undef
  console.log("[build] $ " + (cmd) + "");
  execSync(cmd, { stdio: 'inherit' });
}

function updateVersion() {
  var pkgPath = path.resolve(__dirname, '../package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  try {
    var tag = execSync('git describe --tags --abbrev=0').toString().trim();
    if (tag && pkg.version !== tag.replace(/^v/, '')) {
      pkg.version = tag.replace(/^v/, '');
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      // eslint-disable-next-line no-undef
      console.log("[build] version updated to " + (pkg.version) + "");
    }
  } catch (e) {
    // eslint-disable-next-line no-undef
    console.log('[build] git tag not found, skip version update');
  }
}

function lint() {
  run('npx eslint src --ext .ts');
}

function typeCheck() {
  run('npx tsc --noEmit');
}

function build() {
  run('npx webpack --mode production');
}

function copyAssets() {
  var iconSrc = path.resolve(__dirname, '../resources/icon.png');
  var iconDest = path.resolve(__dirname, '../dist/icon.png');
  if (fs.existsSync(iconSrc)) {
    fs.copyFileSync(iconSrc, iconDest);
    // eslint-disable-next-line no-undef
    console.log('[build] icon.png copied');
  }
}

updateVersion();
lint();
typeCheck();
build();
copyAssets();
// eslint-disable-next-line no-undef
console.log('[build] Build completed.');
