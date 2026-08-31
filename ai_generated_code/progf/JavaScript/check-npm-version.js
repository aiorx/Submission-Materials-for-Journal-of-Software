#!/usr/bin/env node
// Aided with basic GitHub coding tools

/**
 * Validates that the correct npm version is being used
 * Exits with error if version requirements aren't met
 */

const requiredVersion = '11.3.0';
const { execSync } = require('child_process');

try {
  // Get current npm version
  const currentVersion = execSync('npm -v').toString().trim();
  
  // Compare versions
  if (currentVersion !== requiredVersion) {
    console.error(`\x1b[31mError: npm version mismatch!\x1b[0m`);
    console.error(`Required: \x1b[32m${requiredVersion}\x1b[0m`);
    console.error(`Current:  \x1b[31m${currentVersion}\x1b[0m`);
    console.error(`\nPlease use npm v${requiredVersion} for this project.`);
    console.error(`You can switch versions with nvm or install the correct version.`);
    process.exit(1);
  } else {
    console.log(`\x1b[32m✓ Using correct npm version: ${currentVersion}\x1b[0m`);
  }
} catch (error) {
  console.error(`\x1b[31mError checking npm version: ${error.message}\x1b[0m`);
  process.exit(1);
}