// Aided with basic GitHub coding tools
var path = require('path');
var vscode = require('@vscode/test-electron');

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    var extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // The path to the extension test script
    var extensionTestsPath = path.resolve(__dirname, "./suite/index");

    // Download VS Code, unzip it and run the integration test
    await vscode.runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
    });
  } catch (err) {
    console.error("Failed to run tests");
    process.exit(1);
  }
}

main();
