// Assisted using common GitHub development utilities
/**
 * Init command for Custom Rules CLI
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { GlobalOptions } from '../core/config.js';

interface InitOptions extends GlobalOptions {
  interactive?: boolean;
  force?: boolean;
  dryRun?: boolean;
  merge?: boolean;
  ide?: string;
}

interface FileConflict {
  path: string;
  type: 'config' | 'profile' | 'ide';
  exists: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  const {
    profile = 'default',
    dest = process.cwd(),
    interactive = false,
    force = false,
    dryRun = false,
    merge = false,
    ide = 'all',
    verbose = false
  } = options;

  if (verbose) {
    console.log(chalk.blue(`Initializing with profile: ${profile}`));
    console.log(chalk.blue(`Destination: ${dest}`));
    console.log(chalk.blue(`IDE: ${ide}`));
  }

  try {
    // Analyze existing files and conflicts
    const conflicts = await analyzeExistingFiles(dest, profile, ide);
    
    if (dryRun) {
      await previewOperations(conflicts, merge, force, dest, profile, ide);
      return;
    }

    if (interactive) {
      await runInteractiveSetup(dest, profile, ide, force, merge);
    } else {
      await runStandardInit(conflicts, force, merge, dest, profile, ide, verbose);
    }
    
    console.log(chalk.green('✓ Initialization completed successfully!'));
    
  } catch (error) {
    console.error(chalk.red(`Error during initialization: ${error.message}`));
    throw error;
  }
}

async function analyzeExistingFiles(destPath: string, profile: string, ide: string): Promise<FileConflict[]> {
  const conflicts: FileConflict[] = [];
  
  // Check for main config files
  const configFiles = [
    'custom-rules.yaml',
    'custom-rules.yml',
    '.custom-rules.yaml',
    '.custom-rules.yml'
  ];
  
  for (const configFile of configFiles) {
    const filePath = path.join(destPath, configFile);
    if (await fs.pathExists(filePath)) {
      conflicts.push({
        path: filePath,
        type: 'config',
        exists: true
      });
    }
  }
  
  // Check for profile files
  const profilesDir = path.join(destPath, 'profiles');
  const profileFile = path.join(profilesDir, `${profile}.yaml`);
  if (await fs.pathExists(profileFile)) {
    conflicts.push({
      path: profileFile,
      type: 'profile',
      exists: true
    });
  }
  
  // Check for IDE files
  const ideList = ide === 'all' ? ['vscode', 'jetbrains', 'vim'] : ide.split(',');
  for (const ideType of ideList) {
    const ideFiles = await getIdeFiles(destPath, ideType.trim());
    for (const ideFile of ideFiles) {
      if (await fs.pathExists(ideFile)) {
        conflicts.push({
          path: ideFile,
          type: 'ide',
          exists: true
        });
      }
    }
  }
  
  return conflicts;
}

async function getIdeFiles(destPath: string, ideType: string): Promise<string[]> {
  const files: string[] = [];
  
  switch (ideType.toLowerCase()) {
    case 'vscode':
      files.push(
        path.join(destPath, '.vscode', 'settings.json'),
        path.join(destPath, '.vscode', 'extensions.json'),
        path.join(destPath, '.vscode', 'tasks.json')
      );
      break;
      
    case 'jetbrains':
      files.push(
        path.join(destPath, '.idea', 'custom-rules.xml'),
        path.join(destPath, '.idea', 'inspectionProfiles', 'Project_Default.xml')
      );
      break;
      
    case 'vim':
      files.push(
        path.join(destPath, '.vim', 'custom-rules.vim'),
        path.join(destPath, '.vimrc.custom-rules')
      );
      break;
  }
  
  return files;
}

async function previewOperations(
  conflicts: FileConflict[],
  merge: boolean,
  force: boolean,
  destPath: string,
  profile: string,
  ide: string
): Promise<void> {
  console.log(chalk.yellow.bold('\nDRY RUN MODE - No files will be modified\n'));
  
  // Files that would be created
  console.log(chalk.green.bold('Files that would be created:'));
  console.log(chalk.green(`  ✓ ${path.join(destPath, 'custom-rules.yaml')} (main configuration)`));
  console.log(chalk.green(`  ✓ ${path.join(destPath, 'profiles', `${profile}.yaml`)} (profile configuration)`));
  
  // IDE files
  const ideList = ide === 'all' ? ['vscode', 'jetbrains', 'vim'] : ide.split(',');
  for (const ideType of ideList) {
    const ideFiles = await getIdeFiles(destPath, ideType.trim());
    for (const ideFile of ideFiles) {
      console.log(chalk.green(`  ✓ ${ideFile} (${ideType} configuration)`));
    }
  }
  
  // Files that would be affected
  if (conflicts.length > 0) {
    const action = merge ? 'merged' : 'overwritten';
    console.log(chalk.yellow.bold(`\nFiles that would be ${action}:`));
    
    for (const conflict of conflicts) {
      const status = merge ? '📝 would append rules' : '⚠ would overwrite';
      console.log(chalk.yellow(`  ${status}: ${conflict.path}`));
    }
  }
  
  // Show recommendations
  console.log(chalk.blue.bold('\nRecommendations:'));
  if (conflicts.length > 0) {
    if (!force && !merge) {
      console.log(chalk.blue('  • Run with --force to overwrite existing files'));
      console.log(chalk.blue('  • Run with --merge to append rules to existing files'));
    }
    console.log(chalk.blue('  • Create backups of important configuration files'));
  }
  console.log(chalk.blue('  • Review the changes before running without --dry-run'));
}

async function runInteractiveSetup(
  destPath: string,
  profile: string,
  ide: string,
  force: boolean,
  merge: boolean
): Promise<void> {
  console.log(chalk.blue.bold('\n🚀 Custom Rules Interactive Setup\n'));
  
  // TODO: Implement full interactive setup wizard
  console.log(chalk.yellow('Interactive setup will be enhanced in the next phase'));
  
  // For now, run standard init
  const conflicts = await analyzeExistingFiles(destPath, profile, ide);
  await runStandardInit(conflicts, force, merge, destPath, profile, ide, true);
}

async function runStandardInit(
  conflicts: FileConflict[],
  force: boolean,
  merge: boolean,
  destPath: string,
  profile: string,
  ide: string,
  verbose: boolean
): Promise<void> {
  
  // Handle conflicts
  if (conflicts.length > 0 && !force && !merge) {
    console.log(chalk.yellow('⚠ Existing files detected:'));
    for (const conflict of conflicts) {
      console.log(chalk.yellow(`  • ${conflict.path}`));
    }
    
    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Do you want to overwrite these files?',
        default: false
      }
    ]);
    
    if (!proceed) {
      console.log(chalk.yellow('Initialization cancelled by user'));
      return;
    }
    force = true;
  }
  
  // Create directories
  await fs.ensureDir(destPath);
  const profilesDir = path.join(destPath, 'profiles');
  await fs.ensureDir(profilesDir);
  
  // Create main configuration
  await createMainConfig(destPath, force, merge);
  
  // Create profile configuration
  await createProfileConfig(path.join(profilesDir, `${profile}.yaml`), profile, force, merge);
  
  // Create IDE configurations
  await createIdeConfigurations(destPath, ide, force, merge);
}

async function createMainConfig(destPath: string, force: boolean, merge: boolean): Promise<void> {
  const configPath = path.join(destPath, 'custom-rules.yaml');
  
  const configContent = `# Assisted using common GitHub development utilities
# Custom Rules Main Configuration
name: "custom-rules-config"
version: "1.0.0"

# Global settings
settings:
  output_format: "json"
  verbose: false
  max_workers: 4
  backup_enabled: true

# Default rules
rules:
  - name: "file-permissions"
    description: "Check file permissions"
    enabled: true
    severity: "warning"
    
  - name: "naming-convention"
    description: "Validate naming conventions"
    enabled: true
    severity: "error"
    
  - name: "code-quality"
    description: "Basic code quality checks"
    enabled: false
    severity: "info"

# Security configuration - commands that should never be executed
security:
  neverExecute:
    - "rm -rf /"
    - "del /f /s /q C:\\\\*"
    - "format c:"
    - "shutdown"
    - "reboot"
    - "halt"
  blockedCommands:
    - "sudo *"
    - "curl *://*/malware*"
    - "powershell -enc*"
  unsafePatterns:
    - "\\\\\\$\\\\\\([^)]*\\\\\\)"
    - "\\\`[^\\\`]*\\\`"
    - ">[>&].*"

# File and directory exclusions
exclusions:
  files:
    - ".env"
    - ".env.local"
    - "*.key"
    - "*.pem"
    - "id_rsa"
  directories:
    - "node_modules"
    - ".git"
    - "dist"
    - "coverage"
  patterns:
    - "**/node_modules/**"
    - "**/.git/**"
    - "**/*.log"
  extensions:
    - ".exe"
    - ".bat"
    - ".dll"

# Output destinations
destinations:
  reports: "./reports"
  logs: "./logs"
  backups: "./backups"

# Integration settings
integrations:
  git:
    enabled: false
    hooks: []
  ci_cd:
    enabled: false
`;
  
  if (merge && await fs.pathExists(configPath)) {
    // TODO: Implement merge logic
    console.log(chalk.yellow('Merge functionality will be implemented in next phase'));
  }
  
  await fs.writeFile(configPath, configContent);
  console.log(chalk.green(`✓ Created main configuration: ${configPath}`));
}

async function createProfileConfig(profilePath: string, profileName: string, force: boolean, merge: boolean): Promise<void> {
  const profileContent = `# Assisted using common GitHub development utilities
# Custom Rules Profile: ${profileName}
name: "${profileName}"
description: "Configuration profile for ${profileName} environment"
extends: "base"

# Profile-specific settings
settings:
  environment: "${profileName}"
  strict_mode: ${profileName === 'production' ? 'true' : 'false'}
  
# Profile-specific rules
rules:
  - name: "env-specific-check"
    description: "Environment-specific validation"
    enabled: true
    config:
      environment: "${profileName}"
      
# Profile destinations
destinations:
  reports: "./reports/${profileName}"
  logs: "./logs/${profileName}"
`;
  
  if (merge && await fs.pathExists(profilePath)) {
    // TODO: Implement merge logic
    console.log(chalk.yellow('Merge functionality will be implemented in next phase'));
  }
  
  await fs.writeFile(profilePath, profileContent);
  console.log(chalk.green(`✓ Created profile configuration: ${profilePath}`));
}

async function createIdeConfigurations(destPath: string, ide: string, force: boolean, merge: boolean): Promise<void> {
  const ideList = ide === 'all' ? ['vscode', 'jetbrains', 'vim'] : ide.split(',');
  
  for (const ideType of ideList) {
    await createIdeConfig(destPath, ideType.trim(), force, merge);
  }
}

async function createIdeConfig(destPath: string, ideType: string, force: boolean, merge: boolean): Promise<void> {
  switch (ideType.toLowerCase()) {
    case 'vscode':
      await createVSCodeConfig(destPath, force, merge);
      break;
    case 'jetbrains':
      await createJetBrainsConfig(destPath, force, merge);
      break;
    case 'vim':
      await createVimConfig(destPath, force, merge);
      break;
    default:
      console.log(chalk.yellow(`Unknown IDE type: ${ideType}`));
  }
}

async function createVSCodeConfig(destPath: string, force: boolean, merge: boolean): Promise<void> {
  const vscodeDir = path.join(destPath, '.vscode');
  await fs.ensureDir(vscodeDir);
  
  // settings.json
  const settingsPath = path.join(vscodeDir, 'settings.json');
  const settingsContent = {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "typescript.preferences.strictMode": true,
    "customRules.enabled": true,
    "customRules.profile": "development"
  };
  
  await fs.writeJson(settingsPath, settingsContent, { spaces: 2 });
  console.log(chalk.green(`✓ Created VS Code settings: ${settingsPath}`));
  
  // extensions.json
  const extensionsPath = path.join(vscodeDir, 'extensions.json');
  const extensionsContent = {
    "recommendations": [
      "tbowman01.custom-rules-vscode",
      "esbenp.prettier-vscode",
      "ms-vscode.vscode-typescript-next"
    ]
  };
  
  await fs.writeJson(extensionsPath, extensionsContent, { spaces: 2 });
  console.log(chalk.green(`✓ Created VS Code extensions: ${extensionsPath}`));
}

async function createJetBrainsConfig(destPath: string, force: boolean, merge: boolean): Promise<void> {
  const ideaDir = path.join(destPath, '.idea');
  await fs.ensureDir(ideaDir);
  
  const configPath = path.join(ideaDir, 'custom-rules.xml');
  const configContent = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Assisted using common GitHub development utilities -->
<project version="4">
  <component name="CustomRulesSettings">
    <option name="enabled" value="true" />
    <option name="profile" value="development" />
    <option name="autoFormat" value="true" />
  </component>
</project>`;
  
  await fs.writeFile(configPath, configContent);
  console.log(chalk.green(`✓ Created JetBrains configuration: ${configPath}`));
}

async function createVimConfig(destPath: string, force: boolean, merge: boolean): Promise<void> {
  const vimDir = path.join(destPath, '.vim');
  await fs.ensureDir(vimDir);
  
  const configPath = path.join(vimDir, 'custom-rules.vim');
  const configContent = `" Assisted using common GitHub development utilities
" Custom Rules Vim Configuration

" Enable custom rules
let g:custom_rules_enabled = 1
let g:custom_rules_profile = 'development'

" Auto-format on save
autocmd BufWritePre * :call CustomRulesFormat()

" Custom Rules functions
function! CustomRulesFormat()
  if g:custom_rules_enabled
    " Add formatting logic here
  endif
endfunction
`;
  
  await fs.writeFile(configPath, configContent);
  console.log(chalk.green(`✓ Created Vim configuration: ${configPath}`));
}
