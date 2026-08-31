// Aided with basic GitHub coding tools
/**
 * Example usage of security and exclusion features
 */
import { ConfigManager } from '../src/core/config.js';
import { SecurityValidator } from '../src/utils/security.js';

// Initialize configuration with security settings
const config = new ConfigManager({
  profile: 'secure',
  verbose: true
});

// Create security validator
const validator = new SecurityValidator(config.getConfig());

// Example 1: Validate commands before execution
console.log('\n=== Command Security Validation ===');

const commandsToTest = [
  'npm test',                    // Safe command
  'rm -rf /',                    // Never execute
  'sudo rm -rf /var/log',        // Blocked command  
  'echo $(cat /etc/passwd)',     // Unsafe pattern
  'custom-rules validate'        // Safe command
];

commandsToTest.forEach(cmd => {
  const result = validator.validateCommand(cmd);
  console.log(`Command: "${cmd}"`);
  console.log(`  Allowed: ${result.isAllowed}`);
  console.log(`  Risk Level: ${result.riskLevel}`);
  if (result.reason) {
    console.log(`  Reason: ${result.reason}`);
  }
  if (result.suggestion) {
    console.log(`  Suggestion: ${result.suggestion}`);
  }
  console.log('');
});

// Example 2: Check file exclusions
console.log('\n=== File Exclusion Validation ===');

const filesToTest = [
  'src/index.ts',               // Normal file
  '.env',                       // Excluded file
  'node_modules/package.json',  // Excluded directory
  'build.log',                  // Excluded pattern
  'malware.exe',               // Excluded extension
  'README.md'                  // Normal file
];

filesToTest.forEach(file => {
  const excluded = validator.shouldExcludeFile(file);
  console.log(`File: "${file}" - ${excluded ? 'EXCLUDED' : 'INCLUDED'}`);
});

// Example 3: Display security summary
console.log('\n=== Security Configuration Summary ===');
const securitySummary = validator.getSecuritySummary();
console.log('Never Execute Commands:');
securitySummary.neverExecute.forEach(cmd => console.log(`  - ${cmd}`));

console.log('\nBlocked Commands:');
securitySummary.blockedCommands.forEach(cmd => console.log(`  - ${cmd}`));

console.log('\nUnsafe Patterns:');
securitySummary.unsafePatterns.forEach(pattern => console.log(`  - ${pattern}`));

// Example 4: Display exclusion summary
console.log('\n=== Exclusion Configuration Summary ===');
const exclusionSummary = validator.getExclusionSummary();

console.log('Excluded Files:');
exclusionSummary.files.forEach(file => console.log(`  - ${file}`));

console.log('\nExcluded Directories:');
exclusionSummary.directories.forEach(dir => console.log(`  - ${dir}`));

console.log('\nExclusion Patterns:');
exclusionSummary.patterns.forEach(pattern => console.log(`  - ${pattern}`));

console.log('\nExcluded Extensions:');
exclusionSummary.extensions.forEach(ext => console.log(`  - ${ext}`));

export { validator, config };
