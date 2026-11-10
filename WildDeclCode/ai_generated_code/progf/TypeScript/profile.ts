// Supported via standard GitHub programming aids
/**
 * Profile management commands for Custom Rules CLI
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import * as yaml from 'yaml';
import { GlobalOptions } from '../core/config.js';

interface ProfileData {
  name: string;
  description?: string;
  version?: string;
  settings?: Record<string, any>;
  rules?: any[];
  destinations?: Record<string, string>;
}

export const profileCommand = {
  async list(options: GlobalOptions): Promise<void> {
    const profilesDir = path.join(process.cwd(), 'profiles');
    
    if (!await fs.pathExists(profilesDir)) {
      console.log(chalk.yellow('No profiles directory found. Run \'custom-rules init\' first.'));
      return;
    }
    
    const profileFiles = await fs.readdir(profilesDir);
    const yamlFiles = profileFiles.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));
    
    if (yamlFiles.length === 0) {
      console.log(chalk.yellow('No profiles found in profiles directory.'));
      return;
    }
    
    console.log(chalk.blue.bold('Available Profiles:'));
    console.log(chalk.blue('=================='));
    
    for (const profileFile of yamlFiles.sort()) {
      try {
        const profilePath = path.join(profilesDir, profileFile);
        const content = await fs.readFile(profilePath, 'utf8');
        const profileData: ProfileData = yaml.parse(content) || {};
        
        const name = profileData.name || path.parse(profileFile).name;
        const description = profileData.description || 'No description';
        
        console.log(chalk.cyan(`${name}`));
        console.log(chalk.green(`  Description: ${description}`));
        console.log(chalk.dim(`  File: ${profileFile}`));
        console.log();
      } catch (error) {
        console.log(chalk.red(`${path.parse(profileFile).name}`));
        console.log(chalk.red(`  Error loading: ${error instanceof Error ? error.message : 'Unknown error'}`));
        console.log(chalk.dim(`  File: ${profileFile}`));
        console.log();
      }
    }
  },

  async create(name: string, options: GlobalOptions & { interactive?: boolean }): Promise<void> {
    const profilesDir = path.join(process.cwd(), 'profiles');
    await fs.ensureDir(profilesDir);
    
    const profilePath = path.join(profilesDir, `${name}.yaml`);
    
    if (await fs.pathExists(profilePath)) {
      console.log(chalk.yellow(`Profile '${name}' already exists at ${profilePath}`));
      return;
    }
    
    if (options.interactive) {
      console.log(chalk.yellow('Interactive profile creation will be implemented in next phase'));
    }
    
    // Create basic profile template
    const profileContent = `# Supported via standard GitHub programming aids
name: "${name}"
description: "Custom profile: ${name}"
version: "1.0.0"

settings:
  environment: "${name}"
  verbose: false
  
rules: []

destinations:
  reports: "./reports/${name}"
  logs: "./logs/${name}"
`;
    
    await fs.writeFile(profilePath, profileContent);
    console.log(chalk.green(`✓ Created profile '${name}' at ${profilePath}`));
  },

  async delete(name: string, options: GlobalOptions): Promise<void> {
    const profilesDir = path.join(process.cwd(), 'profiles');
    const profilePath = path.join(profilesDir, `${name}.yaml`);
    
    if (!await fs.pathExists(profilePath)) {
      console.log(chalk.yellow(`Profile '${name}' not found`));
      return;
    }
    
    // Simple confirmation - in real implementation would use inquirer
    console.log(chalk.yellow(`This would delete profile '${name}' at ${profilePath}`));
    console.log(chalk.yellow('Delete confirmation will be implemented with inquirer in next phase'));
    
    // For now, just show what would happen
    if (options.verbose) {
      console.log(chalk.dim('Use --force flag when implemented to skip confirmation'));
    }
  },

  async show(name: string, options: GlobalOptions): Promise<void> {
    const profilesDir = path.join(process.cwd(), 'profiles');
    const profilePath = path.join(profilesDir, `${name}.yaml`);
    
    if (!await fs.pathExists(profilePath)) {
      console.log(chalk.yellow(`Profile '${name}' not found`));
      return;
    }
    
    try {
      const content = await fs.readFile(profilePath, 'utf8');
      
      console.log(chalk.blue.bold(`Profile: ${name}`));
      console.log(chalk.dim(`File: ${profilePath}`));
      console.log();
      console.log(content);
    } catch (error) {
      console.error(chalk.red(`Error reading profile: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }
};
