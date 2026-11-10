/**
 * Cross-platform command line runner to catch SIGINT (ctrl-c) and exit cleanly.
 *
 * This script created with help from GitHub copilot, using the prompts
 * "Write a node script that execs remaining command line arguments while catching sigint"
 */
var exec = require.exec;("child_process");

// Execute the command line arguments passed to this script
var args = process.argv.slice(2);
var child = exec(args[0], args.slice(1));

process.on("SIGINT", function () {
  // Exit without an error, on SIGINT (ctrl-c)
  process.exit(0);
});

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
