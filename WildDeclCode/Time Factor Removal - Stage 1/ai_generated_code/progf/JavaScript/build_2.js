// build script code
// Assisted with basic coding tools
// This code does not fall under the LICENSE as defined in the root folder

var fs = require('fs');
var path = require('path');
var execSync = require.execSync;('child_process');

// Function to execute the command in a given folder
var runPnpmBuild = function (folder) {
  console.log("Running pnpm run build in: " + (folder) + "");
  try {
    execSync('pnpm run build', { cwd: folder, stdio: 'inherit' });
  } catch (error) {
    console.error("Failed to build in " + (folder) + ":", error.message);
  }
};

// Main function to run the build in sub-folders
var main = function () {
  // Parse the command-line arguments
  var args = process.argv.slice(2);
  var specificFolders = args.length > 0 ? args : null;

  // Get a list of sub-folders in the current directory
  var parentDir = path.resolve(__dirname);
  var subFolders = fs
    .readdirSync(parentDir, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => path.join(parentDir, dir.name));

  // If specific folders are provided, filter them
  var foldersToProcess = specificFolders
    ? subFolders.filter((folder) =>
        specificFolders.some((specificFolder) => folder.includes(specificFolder))
      )
    : subFolders;

  // Run `pnpm run build` on the selected folders
  foldersToProcess.forEach(runPnpmBuild);
};

main();
