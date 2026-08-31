// Supported via standard GitHub programming aids
/**
 * Configuration management for Custom Rules CLI
 */
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import chalk from 'chalk';

export interface GlobalOptions {
  profile?: string;
  dest?: string;
  verbose?: boolean;
  config?: string;
}

export interface RuleConfig {
  name: string;
  description?: string;
  enabled: boolean;
  severity: 'error' | 'warning' | 'info';
  config?: Record<string, any>;
}

export interface ConfigSchema {
  name: string;
  version: string;
  settings: {
    output_format: string;
    verbose: boolean;
    max_workers?: number;
    backup_enabled?: boolean;
  };
  rules: RuleConfig[];
  destinations: {
    reports: string;
    logs: string;
    backups?: string;
  };
  security: {
    neverExecute: string[];
    blockedCommands: string[];
    unsafePatterns: string[];
  };
  exclusions: {
    files: string[];
    directories: string[];
    patterns: string[];
    extensions: string[];
  };
  integrations: {
    git: {
      enabled: boolean;
      hooks?: string[];
    };
    ci_cd?: {
      enabled: boolean;
    };
  };
}

export class ConfigManager {
  private config: ConfigSchema;
  private profileName: string;
  private verbose: boolean;

  constructor(options: GlobalOptions = {}) {
    this.profileName = options.profile || 'default';
    this.verbose = options.verbose || false;
    this.config = this.getDefaultConfig();
    
    this.loadConfig(options.config);
  }

  private loadConfig(configFile?: string): void {
    const configPaths = this.getConfigPaths(configFile);
    
    for (const configPath of configPaths) {
      if (fs.existsSync(configPath)) {
        try {
          const content = fs.readFileSync(configPath, 'utf8');
          const loadedConfig = yaml.parse(content);
          
          if (loadedConfig) {
            this.config = { ...this.config, ...loadedConfig };
            if (this.verbose) {
              console.log(chalk.green(`Loaded configuration from: ${configPath}`));
            }
            return;
          }
        } catch (error) {
          if (this.verbose) {
            console.log(chalk.yellow(`Failed to load config from ${configPath}: ${error instanceof Error ? error.message : 'Unknown error'}`));
          }
          continue;
        }
      }
    }

    if (this.verbose) {
      console.log(chalk.yellow('Using default configuration'));
    }
  }

  private getConfigPaths(explicitConfig?: string): string[] {
    const paths: string[] = [];
    const cwd = process.cwd();
    const home = require('os').homedir();

    // Explicit config file
    if (explicitConfig) {
      paths.push(path.resolve(explicitConfig));
    }

    // Current directory
    paths.push(
      path.join(cwd, 'custom-rules.yaml'),
      path.join(cwd, 'custom-rules.yml'),
      path.join(cwd, '.custom-rules.yaml'),
      path.join(cwd, '.custom-rules.yml')
    );

    // Profile-specific configs
    const profilesDir = path.join(cwd, 'profiles');
    if (fs.existsSync(profilesDir)) {
      paths.push(
        path.join(profilesDir, `${this.profileName}.yaml`),
        path.join(profilesDir, `${this.profileName}.yml`)
      );
    }

    // Home directory
    paths.push(
      path.join(home, '.config', 'custom-rules', 'config.yaml'),
      path.join(home, '.custom-rules.yaml')
    );

    return paths;
  }

  private getDefaultConfig(): ConfigSchema {
    return {
      name: this.profileName,
      version: '1.0.0',
      settings: {
        output_format: 'json',
        verbose: this.verbose,
        max_workers: 4,
        backup_enabled: true
      },
      rules: [],
      destinations: {
        reports: './reports',
        logs: './logs',
        backups: './backups'
      },
      security: {
        neverExecute: [
          'rm -rf /',
          'del /f /s /q C:\\*',
          'format c:',
          'mkfs.*',
          'sudo rm -rf',
          ':(){ :|:& };:',
          'chmod -R 777 /',
          'dd if=/dev/zero',
          'shutdown',
          'reboot',
          'halt'
        ],
        blockedCommands: [
          'curl *://*/malware*',
          'wget *://*/malware*',
          'powershell -enc*',
          'bash -c "$(curl*',
          'eval*',
          'exec*'
        ],
        unsafePatterns: [
          '\\$\\([^)]*\\)',
          '`[^`]*`',
          '\\$\\{[^}]*\\}',
          '>[>&].*',
          '\\|\\s*sh',
          '\\|\\s*bash'
        ]
      },
      exclusions: {
        files: [
          '.env',
          '.env.local',
          '.env.production',
          '*.key',
          '*.pem',
          '*.p12',
          'id_rsa',
          'id_dsa',
          'known_hosts',
          'authorized_keys'
        ],
        directories: [
          'node_modules',
          '.git',
          'dist',
          'build',
          'coverage',
          '.nyc_output',
          'tmp',
          'temp',
          '.cache'
        ],
        patterns: [
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/build/**',
          '**/*.log',
          '**/*.tmp',
          '**/coverage/**',
          '**/.DS_Store',
          '**/Thumbs.db'
        ],
        extensions: [
          '.exe',
          '.bat',
          '.cmd',
          '.com',
          '.scr',
          '.pif',
          '.msi',
          '.dll'
        ]
      },
      integrations: {
        git: {
          enabled: false,
          hooks: []
        },
        ci_cd: {
          enabled: false
        }
      }
    };
  }

  public get(key: string): any {
    const keys = key.split('.');
    let value: any = this.config;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  public set(key: string, value: any): void {
    const keys = key.split('.');
    let config: any = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in config)) {
        config[k] = {};
      }
      config = config[k];
    }
    
    config[keys[keys.length - 1]] = value;
  }

  public getConfig(): ConfigSchema {
    return { ...this.config };
  }

  public save(filePath?: string): void {
    const outputPath = filePath || path.join(process.cwd(), `${this.profileName}.yaml`);
    
    try {
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const yamlContent = yaml.stringify(this.config);
      fs.writeFileSync(outputPath, yamlContent, 'utf8');
      
      if (this.verbose) {
        console.log(chalk.green(`Configuration saved to: ${outputPath}`));
      }
    } catch (error) {
      console.error(chalk.red(`Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}`));
      throw error;
    }
  }
}
