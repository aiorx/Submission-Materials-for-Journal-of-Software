// Assisted using common GitHub development utilities
/**
 * WikiFlow 2025 Development Iteration Helper
 *
 * This script provides an interactive CLI to streamline the development
 * iteration process for the WikiFlow 2025 project.
 *
 * Features:
 * - Intelligent development server management
 * - Quick access to common development tasks
 * - Error detection and reporting
 * - Performance monitoring
 *
 * Usage: node scripts/flowdev.js
 */

'use strict';

// Using CommonJS modules for compatibility
var spawn = require.spawn;
var execSync = require.execSync;('child_process');
var existsSync = require.existsSync;
var readFileSync = require.readFileSync;('fs');
var dirname = require.dirname;
var join = require.join;('path');
var readline = require('readline');
var chalk = require('chalk');

// Get the current file's directory
var __dirname = dirname(__filename);
var rootDir = join(__dirname, '..');

// Define terminal colors
var colors = {
  info: chalk.blue,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  highlight: chalk.cyan,
  bold: chalk.bold,
};

// Track running processes
var runningProcesses = new Map();

/**
 * Logger utility for consistent output styling
 */
var logger = {
  info: function (message) { return console.log(colors.info('[FlowDev]'), message); },
  success: function (message) { return console.log(colors.success('[✓]'), message); },
  warning: function (message) { return console.log(colors.warning('[!]'), message); },
  error: function (message) { return console.log(colors.error('[✗]'), message); },
  highlight: function (message) { return console.log(colors.highlight(message)); },
  title: function (message) {
    console.log(
      '\n' + colors.bold(colors.highlight('='.repeat(message.length + 4))),
    );
    console.log(colors.bold(colors.highlight("| " + (message) + " |")));
    console.log(
      colors.bold(colors.highlight('='.repeat(message.length + 4))) + '\n',
    );
  },
};

/**
 * Error handling wrapper for async functions
 * @param {Function} fn - Function to wrap with error handling
 */
var withErrorHandling =
  function (fn) { return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logger.error("Operation failed: " + (error.message) + "");
      if (error.stack) {
        logger.info('Stack trace:');
        console.error(error.stack.split('\n').slice(1).join('\n'));
      }
      return null;
    }
  }; };

/**
 * Run a command in a child process
 * @param {string} command - Command to run
 * @param {string[]} args - Command arguments
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Process object
 */
var runCommand = withErrorHandling(
  async function (command, args = [], options = {}) {
    var name = options.name;
var captureOutput = options.captureOutput;
var silent = options.silent;
var cwd = options.cwd;

    if (!silent) {
      logger.info("Running " + (name) + ": " + (command) + " " + (args.join(' ')) + "");
    }

    var stdout = captureOutput ? [] : undefined;
    var stderr = captureOutput ? [] : undefined;

    var childProcess = spawn(command, args, {
      cwd,
      stdio: captureOutput ? 'pipe' : 'inherit',
      shell: true,
    });

    if (captureOutput) {
      childProcess.stdout.on('data', (data) => {
        stdout.push(data.toString());
      });

      childProcess.stderr.on('data', (data) => {
        stderr.push(data.toString());
      });
    }

    return new Promise((resolve, reject) => {
      childProcess.on('close', (code) => {
        if (code !== 0 && !options.ignoreErrors) {
          reject(
            new Error(
              "Command '" + (command) + " " + (args.join(' ')) + "' failed with exit code " + (code) + "",
            ),
          );
          return;
        }

        if (captureOutput) {
          resolve({
            code,
            stdout: stdout.join(''),
            stderr: stderr.join(''),
          });
        } else {
          resolve({ code, process: childProcess });
        }
      });

      childProcess.on('error', (error) => {
        reject(error);
      });
    });
  },
);

/**
 * Start the development servers
 */
var startDevServer = withErrorHandling(async function () {
  logger.title('Starting Development Servers');

  // Kill any existing processes
  stopAllProcesses();

  // Start both frontend and backend
  logger.info('Starting frontend and backend servers...');
  var devProcess = spawn('pnpm', ['dev'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
    detached: false,
  });

  runningProcesses.set('dev', devProcess);

  devProcess.on('close', (code) => {
    if (code !== null && code !== 0) {
      logger.error("Development server exited with code " + (code) + "");
    }
    runningProcesses.delete('dev');
  });

  logger.success('Development servers started');
  logger.info('Press Ctrl+C in the terminal to stop the servers');

  return devProcess;
});

/**
 * Stop all running processes
 */
var stopAllProcesses = function () {
  for (var [name, process] of runningProcesses.entries()) {
    logger.info("Stopping " + (name) + " process...");

    // Different handling based on platform
    if (process.pid) {
      try {
        // On Unix systems, negative PID kills the process group
        process.kill('SIGTERM');
        logger.success("" + (name) + " process stopped");
      } catch (error) {
        logger.error("Failed to stop " + (name) + " process: " + (error.message) + "");
      }
    }

    runningProcesses.delete(name);
  }
};

/**
 * Run the status check script
 */
var checkStatus = withErrorHandling(async function () {
  logger.title('Checking Project Status');

  // Use the existing flowstatus.sh script
  var result = await runCommand('bash', ['scripts/flowstatus.sh']);

  if (result.code === 0) {
    logger.success('Status check completed successfully');
  }

  return result;
});

/**
 * Run lint checks
 */
var runLint = withErrorHandling(async function () {
  logger.title('Running Lint Checks');

  // Get the list of linting tasks
  var packages = ['frontend', 'backend', 'drizzle'];

  for (var pkg of packages) {
    if (existsSync(join(rootDir, pkg))) {
      logger.info("Linting " + (pkg) + "...");

      try {
        await runCommand('pnpm', ['--filter', pkg, 'lint'], {
          name: "" + (pkg) + " lint",
        });
        logger.success("" + (pkg) + " lint completed");
      } catch (error) {
        logger.error("" + (pkg) + " lint failed: " + (error.message) + "");
      }
    }
  }

  logger.success('Lint checks completed');
});

/**
 * Build the project
 */
var buildProject = withErrorHandling(async function () {
  logger.title('Building Project');

  var packages = ['frontend', 'backend'];

  for (var pkg of packages) {
    logger.info("Building " + (pkg) + "...");

    try {
      await runCommand('pnpm', ['--filter', pkg, 'build'], {
        name: "" + (pkg) + " build",
      });
      logger.success("" + (pkg) + " build completed");
    } catch (error) {
      logger.error("" + (pkg) + " build failed: " + (error.message) + "");
      return false;
    }
  }

  logger.success('Build completed successfully');
  return true;
});

/**
 * Run database migrations
 */
var runMigrations = withErrorHandling(async function () {
  logger.title('Running Database Migrations');

  if (!existsSync(join(rootDir, 'drizzle'))) {
    logger.error('Drizzle directory not found');
    return false;
  }

  try {
    // Check if migrations are needed
    var result = await runCommand(
      'pnpm',
      ['--filter', 'drizzle', 'drizzle-kit', 'generate:sqlite'],
      {
        name: 'check migrations',
        captureOutput: true,
      },
    );

    if (result.stdout && result.stdout.includes('No schema changes detected')) {
      logger.success('No database migrations needed');
      return true;
    }

    // Run migration
    await runCommand(
      'pnpm',
      ['--filter', 'drizzle', 'drizzle-kit', 'push:sqlite'],
      {
        name: 'run migration',
      },
    );

    logger.success('Database migrations completed successfully');
    return true;
  } catch (error) {
    logger.error("Database migration failed: " + (error.message) + "");
    return false;
  }
});

/**
 * Interactive menu for development iteration
 */
var showIterationMenu = async function () {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  var askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  };

  while (true) {
    logger.title('WikiFlow 2025 Development Iteration');

    console.log(colors.bold('Choose an action:'));
    console.log('1. Start development servers');
    console.log('2. Check project status');
    console.log('3. Run lint checks');
    console.log('4. Build project');
    console.log('5. Run database migrations');
    console.log('6. Run all (lint, build, migrations)');
    console.log('7. Exit');

    var answer = await askQuestion('\nEnter option (1-7): ');

    switch (answer.trim()) {
      case '1':
        await startDevServer();
        break;
      case '2':
        await checkStatus();
        break;
      case '3':
        await runLint();
        break;
      case '4':
        await buildProject();
        break;
      case '5':
        await runMigrations();
        break;
      case '6':
        logger.title('Running Full Iteration');
        await runLint();
        var buildSuccess = await buildProject();
        if (buildSuccess) {
          await runMigrations();
          logger.success('All tasks completed successfully');
        }
        break;
      case '7':
        logger.info('Exiting...');
        stopAllProcesses();
        rl.close();
        return;
      default:
        logger.warning('Invalid option, please try again');
    }

    // Add a small delay before showing the menu again
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

/**
 * Process command line arguments and run the appropriate action
 */
var processArguments = async function () {
  var args = process.argv.slice(2);

  if (args.length === 0) {
    // No arguments, show interactive menu
    await showIterationMenu();
    return;
  }

  switch (args[0]) {
    case 'start':
      await startDevServer();
      break;
    case 'status':
      await checkStatus();
      break;
    case 'lint':
      await runLint();
      break;
    case 'build':
      await buildProject();
      break;
    case 'migrate':
      await runMigrations();
      break;
    case 'iterate':
      await runLint();
      var buildSuccess = await buildProject();
      if (buildSuccess) {
        await runMigrations();
        await startDevServer();
      }
      break;
    default:
      logger.error("Unknown command: " + (args[0]) + "");
      logger.info(
        'Available commands: start, status, lint, build, migrate, iterate',
      );
      process.exit(1);
  }
};

// Handle exit signals to clean up processes
process.on('SIGINT', function () {
  logger.info('Received interrupt signal, shutting down...');
  stopAllProcesses();
  process.exit(0);
});

process.on('SIGTERM', function () {
  logger.info('Received termination signal, shutting down...');
  stopAllProcesses();
  process.exit(0);
});

// Main entry point
(async function () {
  try {
    await processArguments();
  } catch (error) {
    logger.error("An unexpected error occurred: " + (error.message) + "");
    logger.error(error.stack);
    process.exit(1);
  }
})();
