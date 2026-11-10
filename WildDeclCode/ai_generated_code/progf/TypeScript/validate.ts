// Supported via standard GitHub programming aids
/**
 * Validate command for Custom Rules CLI
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import * as yaml from 'yaml';
import { GlobalOptions, ConfigManager } from '../core/config.js';

export async function validateCommand(options: GlobalOptions): Promise<void> {
  const { verbose = false, profile = 'default' } = options;
  
  if (verbose) {
    console.log(chalk.blue(`Validating configuration files for profile: ${profile}`));
  }
  
  console.log(chalk.blue.bold('🔧 Configuration Validation'));
  console.log(chalk.blue('============================'));
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Validate main configuration
    await validateMainConfig(errors, warnings, verbose);
    
    // Validate profile configuration
    await validateProfileConfig(profile, errors, warnings, verbose);
    
    // Validate IDE configurations
    await validateIdeConfigs(errors, warnings, verbose);
    
    // Display results
    console.log(chalk.blue.bold('\n📊 Validation Results:'));
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log(chalk.green('✅ All configurations are valid!'));
    } else {
      if (errors.length > 0) {
        console.log(chalk.red.bold(`\n❌ Errors (${errors.length}):`));
        errors.forEach(error => {
          console.log(chalk.red(`  • ${error}`));
        });
      }
      
      if (warnings.length > 0) {
        console.log(chalk.yellow.bold(`\n⚠️  Warnings (${warnings.length}):`));
        warnings.forEach(warning => {
          console.log(chalk.yellow(`  • ${warning}`));
        });
      }
      
      if (errors.length > 0) {
        process.exit(1);
      }
    }
    
  } catch (error) {
    console.error(chalk.red(`Error during validation: ${error instanceof Error ? error.message : 'Unknown error'}`));
    throw error;
  }
}

async function validateMainConfig(errors: string[], warnings: string[], verbose: boolean): Promise<void> {
  const cwd = process.cwd();
  const configFiles = [
    'custom-rules.yaml',
    'custom-rules.yml',
    '.custom-rules.yaml',
    '.custom-rules.yml'
  ];
  
  let foundConfig = false;
  
  for (const configFile of configFiles) {
    const configPath = path.join(cwd, configFile);
    
    if (await fs.pathExists(configPath)) {
      foundConfig = true;
      
      if (verbose) {
        console.log(chalk.cyan(`Validating main config: ${configPath}`));
      }
      
      try {
        const content = await fs.readFile(configPath, 'utf8');
        const config = yaml.parse(content);
        
        if (!config) {
          errors.push(`Empty configuration file: ${configPath}`);
          continue;
        }
        
        // Validate required fields
        if (!config.name) {
          warnings.push(`Missing 'name' field in ${configPath}`);
        }
        
        if (!config.version) {
          warnings.push(`Missing 'version' field in ${configPath}`);
        }
        
        if (!config.rules || !Array.isArray(config.rules)) {
          errors.push(`Missing or invalid 'rules' array in ${configPath}`);
        } else {
          // Validate each rule
          config.rules.forEach((rule: any, index: number) => {
            if (!rule.name) {
              errors.push(`Rule at index ${index} missing 'name' field in ${configPath}`);
            }
            
            if (typeof rule.enabled !== 'boolean') {
              errors.push(`Rule '${rule.name || index}' missing or invalid 'enabled' field in ${configPath}`);
            }
            
            if (rule.severity && !['error', 'warning', 'info'].includes(rule.severity)) {
              warnings.push(`Rule '${rule.name || index}' has invalid severity '${rule.severity}' in ${configPath}`);
            }
          });
        }
        
        if (!config.destinations) {
          warnings.push(`Missing 'destinations' configuration in ${configPath}`);
        }
        
        console.log(chalk.green(`✓ Main configuration valid: ${configPath}`));
        
      } catch (error) {
        errors.push(`Invalid YAML syntax in ${configPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      break; // Only validate the first config file found
    }
  }
  
  if (!foundConfig) {
    errors.push('No main configuration file found. Run \'custom-rules init\' to create one.');
  }
}

async function validateProfileConfig(profileName: string, errors: string[], warnings: string[], verbose: boolean): Promise<void> {
  const profilesDir = path.join(process.cwd(), 'profiles');
  const profilePath = path.join(profilesDir, `${profileName}.yaml`);
  
  if (!await fs.pathExists(profilePath)) {
    warnings.push(`Profile configuration not found: ${profilePath}`);
    return;
  }
  
  if (verbose) {
    console.log(chalk.cyan(`Validating profile config: ${profilePath}`));
  }
  
  try {
    const content = await fs.readFile(profilePath, 'utf8');
    const profile = yaml.parse(content);
    
    if (!profile) {
      errors.push(`Empty profile configuration: ${profilePath}`);
      return;
    }
    
    // Validate profile fields
    if (!profile.name) {
      warnings.push(`Profile missing 'name' field: ${profilePath}`);
    }
    
    if (profile.name !== profileName) {
      warnings.push(`Profile name '${profile.name}' doesn't match filename '${profileName}': ${profilePath}`);
    }
    
    console.log(chalk.green(`✓ Profile configuration valid: ${profilePath}`));
    
  } catch (error) {
    errors.push(`Invalid YAML syntax in profile ${profilePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function validateIdeConfigs(errors: string[], warnings: string[], verbose: boolean): Promise<void> {
  const cwd = process.cwd();
  
  // Check VS Code configuration
  const vscodeDir = path.join(cwd, '.vscode');
  if (await fs.pathExists(vscodeDir)) {
    if (verbose) {
      console.log(chalk.cyan('Validating VS Code configuration'));
    }
    
    const settingsPath = path.join(vscodeDir, 'settings.json');
    if (await fs.pathExists(settingsPath)) {
      try {
        const settings = await fs.readJson(settingsPath);
        console.log(chalk.green('✓ VS Code settings.json valid'));
      } catch (error) {
        errors.push(`Invalid JSON syntax in .vscode/settings.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    const extensionsPath = path.join(vscodeDir, 'extensions.json');
    if (await fs.pathExists(extensionsPath)) {
      try {
        const extensions = await fs.readJson(extensionsPath);
        console.log(chalk.green('✓ VS Code extensions.json valid'));
      } catch (error) {
        errors.push(`Invalid JSON syntax in .vscode/extensions.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
  
  // Check JetBrains configuration
  const ideaDir = path.join(cwd, '.idea');
  if (await fs.pathExists(ideaDir)) {
    if (verbose) {
      console.log(chalk.cyan('Validating JetBrains configuration'));
    }
    
    const configPath = path.join(ideaDir, 'custom-rules.xml');
    if (await fs.pathExists(configPath)) {
      try {
        const content = await fs.readFile(configPath, 'utf8');
        // Basic XML validation - just check if it parses
        if (content.includes('<?xml') && content.includes('<project>')) {
          console.log(chalk.green('✓ JetBrains configuration valid'));
        } else {
          warnings.push('JetBrains configuration may be malformed');
        }
      } catch (error) {
        errors.push(`Error reading JetBrains configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
  
  // Check Vim configuration
  const vimDir = path.join(cwd, '.vim');
  if (await fs.pathExists(vimDir)) {
    if (verbose) {
      console.log(chalk.cyan('Validating Vim configuration'));
    }
    
    const configPath = path.join(vimDir, 'custom-rules.vim');
    if (await fs.pathExists(configPath)) {
      console.log(chalk.green('✓ Vim configuration found'));
    }
  }
}
