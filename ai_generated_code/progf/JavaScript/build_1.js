#!/usr/bin/env node
// Assisted using common GitHub development utilities
/* global __dirname */
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { execSync } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const path = require('path');

function run(cmd) {
  // eslint-disable-next-line no-undef
  console.log(`[build] $ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function updateVersion() {
  const pkgPath = path.resolve(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  try {
    const tag = execSync('git describe --tags --abbrev=0').toString().trim();
    if (tag && pkg.version !== tag.replace(/^v/, '')) {
      pkg.version = tag.replace(/^v/, '');
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      // eslint-disable-next-line no-undef
      console.log(`[build] version updated to ${pkg.version}`);
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
  const iconSrc = path.resolve(__dirname, '../resources/icon.png');
  const iconDest = path.resolve(__dirname, '../dist/icon.png');
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
