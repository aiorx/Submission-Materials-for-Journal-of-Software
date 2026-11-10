// Aided with basic GitHub coding tools
/**
 * Example usage of security and exclusion features
 */
var ConfigManager = require('../src/core/config.js').ConfigManager;
var SecurityValidator = require('../src/utils/security.js').SecurityValidator;

// Initialize configuration with security settings
var config = new ConfigManager({
  profile: 'secure',
  verbose: true
});

// Create security validator
var validator = new SecurityValidator(config.getConfig());

// Example 1: Validate commands before execution
console.log('\n=== Command Security Validation ===');

var commandsToTest = [
  'npm test',                    // Safe command
  'rm -rf /',                    // Never execute
  'sudo rm -rf /var/log',        // Blocked command  
  'echo $(cat /etc/passwd)',     // Unsafe pattern
  'custom-rules validate'        // Safe command
];

commandsToTest.forEach(function cmd {
  var result = validator.validateCommand(cmd);
  console.log('Command: "' + (cmd) + '"');
  console.log("  Allowed: " + (result.isAllowed) + "");
  console.log("  Risk Level: " + (result.riskLevel) + "");
  if (result.reason) {
    console.log("  Reason: " + (result.reason) + "");
  }
  if (result.suggestion) {
    console.log("  Suggestion: " + (result.suggestion) + "");
  }
  console.log('');
});

// Example 2: Check file exclusions
console.log('\n=== File Exclusion Validation ===');

var filesToTest = [
  'src/index.ts',               // Normal file
  '.env',                       // Excluded file
  'node_modules/package.json',  // Excluded directory
  'build.log',                  // Excluded pattern
  'malware.exe',               // Excluded extension
  'README.md'                  // Normal file
];

filesToTest.forEach(function file {
  var excluded = validator.shouldExcludeFile(file);
  console.log('File: "' + (file) + '" - ' + (excluded ? 'EXCLUDED' : 'INCLUDED') + "");
});

// Example 3: Display security summary
console.log('\n=== Security Configuration Summary ===');
var securitySummary = validator.getSecuritySummary();
console.log('Never Execute Commands:');
securitySummary.neverExecute.forEach(function cmd { return console.log("  - " + (cmd) + ""); });

console.log('\nBlocked Commands:');
securitySummary.blockedCommands.forEach(function cmd { return console.log("  - " + (cmd) + ""); });

console.log('\nUnsafe Patterns:');
securitySummary.unsafePatterns.forEach(function pattern { return console.log("  - " + (pattern) + ""); });

// Example 4: Display exclusion summary
console.log('\n=== Exclusion Configuration Summary ===');
var exclusionSummary = validator.getExclusionSummary();

console.log('Excluded Files:');
exclusionSummary.files.forEach(function file { return console.log("  - " + (file) + ""); });

console.log('\nExcluded Directories:');
exclusionSummary.directories.forEach(function dir { return console.log("  - " + (dir) + ""); });

console.log('\nExclusion Patterns:');
exclusionSummary.patterns.forEach(function pattern { return console.log("  - " + (pattern) + ""); });

console.log('\nExcluded Extensions:');
exclusionSummary.extensions.forEach(function ext { return console.log("  - " + (ext) + ""); });

module.exports.validator = validator;
module.exports.config = config;
