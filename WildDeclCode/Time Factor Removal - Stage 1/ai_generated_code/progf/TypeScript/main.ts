// Aided with basic GitHub coding tools
/**
 * Main CLI entry point for Custom Rules
 */
var Command = require('commander').Command;
var chalk = require('chalk');
var existsSync = require('fs').existsSync;
var join = require('path').join;

var ConfigManager = require('../core/config.js').ConfigManager;
var initCommand = require('./commands/init.js').initCommand;
var profileCommand = require('./commands/profile.js').profileCommand;
var runCommand = require('./commands/run.js').runCommand;
var validateCommand = require('./commands/validate.js').validateCommand;

var program = new Command();

// Global options and configuration
program
  .name('custom-rules')
  .description('A customizable CLI tool for project rules validation and enforcement')
  .version('1.0.0')
  .option('-p, --profile <profile>', 'Configuration profile to use')
  .option('-d, --dest <dest>', 'Destination directory for outputs')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('-c, --config <config>', 'Path to configuration file');

// Global error handler
program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: function (cmd) { return cmd.name() + ' ' + cmd.usage(); },
});

// Initialize command with enhanced options
program
  .command('init')
  .description('Initialize configuration with advanced options')
  .option('-i, --interactive', 'Launch interactive setup wizard')
  .option('-f, --force', 'Overwrite existing files without prompting')
  .option('-n, --dry-run', 'Show what files would be created/modified')
  .option('-m, --merge', 'Append rules to existing files instead of overwriting')
  .option('--ide <ide>', 'Specify IDE (vscode, jetbrains, vim, all)', 'all')
  .action(async function (options) {
    var globalOpts = program.opts();
    await initCommand({ ...globalOpts, ...options });
  });

// Profile management commands
var profileCmd = program
  .command('profile')
  .description('Manage configuration profiles');

profileCmd
  .command('list')
  .description('List available profiles')
  .action(async function () {
    var globalOpts = program.opts();
    await profileCommand.list(globalOpts);
  });

profileCmd
  .command('create <name>')
  .description('Create a new profile')
  .option('-i, --interactive', 'Create profile interactively')
  .action(async function (name, options) {
    var globalOpts = program.opts();
    await profileCommand.create(name, { ...globalOpts, ...options });
  });

profileCmd
  .command('delete <name>')
  .description('Delete a profile')
  .action(async function (name) {
    var globalOpts = program.opts();
    await profileCommand.delete(name, globalOpts);
  });

profileCmd
  .command('show <name>')
  .description('Show profile details')
  .action(async function (name) {
    var globalOpts = program.opts();
    await profileCommand.show(name, globalOpts);
  });

// Run command
program
  .command('run')
  .description('Execute rules validation')
  .option('-r, --report <format>', 'Generate report in specified format (json, yaml, html)')
  .action(async function (options) {
    var globalOpts = program.opts();
    await runCommand({ ...globalOpts, ...options });
  });

// Validate command
program
  .command('validate')
  .description('Validate configuration files')
  .action(async function () {
    var globalOpts = program.opts();
    await validateCommand(globalOpts);
  });

// Info command
program
  .command('info')
  .description('Show current configuration and status')
  .action(async function () {
    var globalOpts = program.opts();
    
    console.log(chalk.blue.bold('Custom Rules CLI Information'));
    console.log(chalk.green('Version:'), '1.0.0');
    console.log(chalk.green('Profile:'), globalOpts.profile || 'default');
    console.log(chalk.green('Destination:'), globalOpts.dest || 'current directory');
    console.log(chalk.green('Verbose:'), globalOpts.verbose ? 'enabled' : 'disabled');
    console.log(chalk.green('Config File:'), globalOpts.config || 'auto-detected');
    
    try {
      var configManager = new ConfigManager(globalOpts);
      console.log(chalk.green('Config Status:'), chalk.green('Loaded'));
    } catch (error) {
      console.log(chalk.green('Config Status:'), chalk.yellow('Not loaded'));
      if (globalOpts.verbose) {
        console.log(chalk.red('Error:'), error.message);
      }
    }
  });

// Error handling
program.exitOverride();

async function main() {
  try {
    await program.parseAsync();
  } catch (error) {
    if (error.code === 'commander.help') {
      process.exit(0);
    } else if (error.code === 'commander.version') {
      process.exit(0);
    } else {
      console.error(chalk.red('Error:'), error.message);
      if (program.opts().verbose) {
        console.error(chalk.red('Stack trace:'), error.stack);
      }
      process.exit(1);
    }
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', function (reason, promise) {
  console.error(chalk.red('Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', function (error) {
  console.error(chalk.red('Uncaught Exception:'), error);
  process.exit(1);
});

if (require.main === module) {
  main();
}

module.exports = program;
