// Aided with basic GitHub coding tools

/**
 * WikiFlow Code Quality CLI
 *
 * A powerful CLI for maintaining code quality in the WikiFlow 2025 project.
 * Run with --help to see available options.
 */

var execSync = require.execSync;('child_process');
var fs = require('fs');
var path = require('path');
var readline = require('readline');

// Terminal colors for better output
var colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

var args = process.argv.slice(2);
var helpRequested = args.includes('--help') || args.includes('-h');
var fixMode = args.includes('--fix') || args.includes('-f');
var strictMode = args.includes('--strict') || args.includes('-s');
var verboseMode = args.includes('--verbose') || args.includes('-v');
var typeCheck = args.includes('--type-check') || args.includes('-t');
var lintOnly = args.includes('--lint-only');
var formatOnly = args.includes('--format-only');
var noEmoji = args.includes('--no-emoji');

// Customized emojis for better UX
var emojis = noEmoji
  ? {
      check: '[OK]',
      error: '[ERROR]',
      warning: '[WARN]',
      info: '[INFO]',
      rocket: '[STARTED]',
      sparkles: '[DONE]',
    }
  : {
      check: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      rocket: '🚀',
      sparkles: '✨',
    };

/**
 * Display help message
 */
function showHelp() {
  console.log("" + (colors.bright) + "" + (colors.cyan) + "WikiFlow Code Quality CLI" + (colors.reset) + "

A tool for maintaining code quality in the WikiFlow 2025 project.

" + (colors.bright) + "Usage:" + (colors.reset) + "
  node code-quality.js [options]

" + (colors.bright) + "Options:" + (colors.reset) + "
  -h, --help       Show this help message
  -f, --fix        Automatically fix issues when possible
  -s, --strict     Enable strict mode (treat warnings as errors)
  -v, --verbose    Show detailed output
  -t, --type-check Run TypeScript type checking
  --lint-only      Only run ESLint (skip Prettier)
  --format-only    Only run Prettier (skip ESLint)
  --no-emoji       Display without emojis

" + (colors.bright) + "Examples:" + (colors.reset) + "
  node code-quality.js                Run all checks
  node code-quality.js --fix          Fix issues automatically
  node code-quality.js --strict       Fail on warnings
  node code-quality.js --lint-only    Only run linting checks
  ");
  process.exit(0);
}

if (helpRequested) {
  showHelp();
}

/**
 * Execute a command and handle errors
 * @param {string} command - The command to execute
 * @param {string} errorMessage - The message to display on error
 * @param {boolean} ignoreErrors - Whether to continue on error
 * @returns {string} - The command output
 */
function execCommand(command, errorMessage, ignoreErrors = false) {
  try {
    if (verboseMode) {
      console.log("" + (colors.dim) + "> " + (command) + "" + (colors.reset) + "");
    }
    var output = execSync(command, { encoding: 'utf8' });
    return output;
  } catch (error) {
    if (!ignoreErrors) {
      console.error("" + (emojis.error) + " " + (colors.red) + "" + (errorMessage) + "" + (colors.reset) + "");
      if (verboseMode) {
        console.error("" + (colors.dim) + "" + (error.message) + "" + (colors.reset) + "");
      }
      if (strictMode) {
        process.exit(1);
      }
    }
    return error.output?.toString() || '';
  }
}

/**
 * Check if a dependency is installed
 * @param {string} packageName - The package to check
 * @returns {boolean} - Whether the package is installed
 */
function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName, { paths: [process.cwd()] });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Main function to run checks
 */
async function runChecks() {
  console.log(
    "" + (emojis.rocket) + " " + (colors.bright) + "" + (colors.blue) + "Running WikiFlow Code Quality Checks" + (colors.reset) + "\n"
  );

  var eslintIssues = 0;
  var prettierIssues = 0;
  var typeIssues = 0;

  // Check TypeScript types
  if (typeCheck) {
    console.log("" + (emojis.info) + " " + (colors.cyan) + "Running TypeScript type checking..." + (colors.reset) + "");

    try {
      execSync('npx tsc --noEmit', { stdio: verboseMode ? 'inherit' : 'pipe' });
      console.log("" + (emojis.check) + " " + (colors.green) + "TypeScript types are valid" + (colors.reset) + "");
    } catch (error) {
      typeIssues++;
      console.error("" + (emojis.error) + " " + (colors.red) + "TypeScript type issues found" + (colors.reset) + "");
      if (verboseMode) {
        console.error(error.stdout?.toString());
      } else {
        console.error("  " + (colors.yellow) + "Run with --verbose to see details" + (colors.reset) + "");
      }
    }
  }

  // Run ESLint if not format-only
  if (!formatOnly) {
    if (!isPackageInstalled('eslint')) {
      console.error(
        "" + (emojis.error) + " " + (colors.red) + "ESLint is not installed. Skipping linting." + (colors.reset) + ""
      );
    } else {
      console.log("" + (emojis.info) + " " + (colors.cyan) + "Running ESLint..." + (colors.reset) + "");

      var eslintCommand = fixMode
        ? 'npx eslint --ext .js,.jsx,.ts,.tsx src/ --fix'
        : 'npx eslint --ext .js,.jsx,.ts,.tsx src/';

      try {
        execSync(eslintCommand, { stdio: verboseMode ? 'inherit' : 'pipe' });
        console.log("" + (emojis.check) + " " + (colors.green) + "No ESLint issues found" + (colors.reset) + "");
      } catch (error) {
        eslintIssues++;
        console.error("" + (emojis.error) + " " + (colors.red) + "ESLint issues found" + (colors.reset) + "");
        if (!verboseMode && !fixMode) {
          console.error(
            "  " + (colors.yellow) + "Run with --fix to automatically fix issues" + (colors.reset) + ""
          );
        }
      }
    }
  }

  // Run Prettier if not lint-only
  if (!lintOnly) {
    if (!isPackageInstalled('prettier')) {
      console.error(
        "" + (emojis.error) + " " + (colors.red) + "Prettier is not installed. Skipping formatting." + (colors.reset) + ""
      );
    } else {
      console.log("" + (emojis.info) + " " + (colors.cyan) + "Running Prettier..." + (colors.reset) + "");

      var prettierCheckCommand = 'npx prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,md}"';
      var prettierWriteCommand = 'npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,md}"';

      if (fixMode) {
        var output = execCommand(
          prettierWriteCommand,
          'Error while formatting files with Prettier'
        );
        console.log("" + (emojis.check) + " " + (colors.green) + "Files formatted with Prettier" + (colors.reset) + "");
      } else {
        try {
          execSync(prettierCheckCommand, { stdio: verboseMode ? 'inherit' : 'pipe' });
          console.log(
            "" + (emojis.check) + " " + (colors.green) + "All files are properly formatted" + (colors.reset) + ""
          );
        } catch (error) {
          prettierIssues++;
          console.error("" + (emojis.error) + " " + (colors.red) + "Formatting issues found" + (colors.reset) + "");
          if (!verboseMode) {
            console.error(
              "  " + (colors.yellow) + "Run with --fix to automatically fix issues" + (colors.reset) + ""
            );
          }
        }
      }
    }
  }

  // Summary
  console.log(
    "\n" + (emojis.sparkles) + " " + (colors.bright) + "" + (colors.blue) + "WikiFlow Code Quality Check Summary" + (colors.reset) + ""
  );

  var totalIssues = eslintIssues + prettierIssues + typeIssues;
  if (totalIssues === 0) {
    console.log("" + (emojis.check) + " " + (colors.green) + "All checks passed successfully!" + (colors.reset) + "");
  } else {
    console.log("" + (emojis.warning) + " " + (colors.yellow) + "Issues found:" + (colors.reset) + "");
    if (eslintIssues > 0)
      console.log("  " + (colors.yellow) + "- ESLint issues: " + (eslintIssues) + "" + (colors.reset) + "");
    if (prettierIssues > 0)
      console.log("  " + (colors.yellow) + "- Prettier issues: " + (prettierIssues) + "" + (colors.reset) + "");
    if (typeIssues > 0)
      console.log("  " + (colors.yellow) + "- TypeScript issues: " + (typeIssues) + "" + (colors.reset) + "");

    if (fixMode) {
      console.log(
        "" + (emojis.info) + " " + (colors.cyan) + "Some issues were automatically fixed. Re-run to check remaining issues." + (colors.reset) + ""
      );
    } else {
      console.log(
        "" + (emojis.info) + " " + (colors.cyan) + "Run with --fix to automatically fix some issues." + (colors.reset) + ""
      );
    }

    if (strictMode) {
      console.error(
        "" + (emojis.error) + " " + (colors.red) + "Strict mode enabled. Exiting with error." + (colors.reset) + ""
      );
      process.exit(1);
    }
  }
}

// Run the main function
runChecks().catch(function error {
  console.error("" + (emojis.error) + " " + (colors.red) + "Unexpected error:" + (colors.reset) + "", error);
  process.exit(1);
});
