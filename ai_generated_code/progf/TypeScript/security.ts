// Assisted using common GitHub development utilities
/**
 * Security utilities for Custom Rules CLI
 */
import * as path from 'path';
import { ConfigSchema } from '../core/config.js';

export interface SecurityValidationResult {
  isAllowed: boolean;
  reason?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  suggestion?: string;
}

export class SecurityValidator {
  private config: ConfigSchema;

  constructor(config: ConfigSchema) {
    this.config = config;
  }

  /**
   * Validate if a command is safe to execute
   */
  validateCommand(command: string): SecurityValidationResult {
    const normalizedCommand = command.toLowerCase().trim();

    // Check against never-execute list
    for (const blocked of this.config.security.neverExecute) {
      if (this.matchesPattern(normalizedCommand, blocked.toLowerCase())) {
        return {
          isAllowed: false,
          reason: `Command matches blocked pattern: ${blocked}`,
          riskLevel: 'critical',
          suggestion: 'This command is explicitly forbidden for security reasons.'
        };
      }
    }

    // Check against blocked commands
    for (const blocked of this.config.security.blockedCommands) {
      if (this.matchesPattern(normalizedCommand, blocked.toLowerCase())) {
        return {
          isAllowed: false,
          reason: `Command matches blocked pattern: ${blocked}`,
          riskLevel: 'high',
          suggestion: 'Consider using a safer alternative or review the command carefully.'
        };
      }
    }

    // Check against unsafe patterns
    for (const pattern of this.config.security.unsafePatterns) {
      if (new RegExp(pattern, 'i').test(command)) {
        return {
          isAllowed: false,
          reason: `Command contains unsafe pattern: ${pattern}`,
          riskLevel: 'medium',
          suggestion: 'Review command for potential security risks before execution.'
        };
      }
    }

    return {
      isAllowed: true,
      riskLevel: 'low'
    };
  }

  /**
   * Validate if a file should be excluded from processing
   */
  shouldExcludeFile(filePath: string): boolean {
    const basename = path.basename(filePath);
    const ext = path.extname(filePath);
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Check exact file matches
    if (this.config.exclusions.files.includes(basename)) {
      return true;
    }

    // Check extension matches
    if (this.config.exclusions.extensions.includes(ext)) {
      return true;
    }

    // Check directory matches
    for (const dir of this.config.exclusions.directories) {
      if (normalizedPath.includes(`/${dir}/`) || normalizedPath.includes(`\\${dir}\\`)) {
        return true;
      }
    }

    // Check pattern matches
    for (const pattern of this.config.exclusions.patterns) {
      if (this.matchesGlobPattern(normalizedPath, pattern)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get list of excluded patterns for display
   */
  getExclusionSummary(): {
    files: string[];
    directories: string[];
    patterns: string[];
    extensions: string[];
  } {
    return {
      files: [...this.config.exclusions.files],
      directories: [...this.config.exclusions.directories],
      patterns: [...this.config.exclusions.patterns],
      extensions: [...this.config.exclusions.extensions]
    };
  }

  /**
   * Get list of security restrictions for display
   */
  getSecuritySummary(): {
    neverExecute: string[];
    blockedCommands: string[];
    unsafePatterns: string[];
  } {
    return {
      neverExecute: [...this.config.security.neverExecute],
      blockedCommands: [...this.config.security.blockedCommands],
      unsafePatterns: [...this.config.security.unsafePatterns]
    };
  }

  private matchesPattern(text: string, pattern: string): boolean {
    // Simple wildcard matching
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    
    return new RegExp(`^${regexPattern}$`, 'i').test(text);
  }

  private matchesGlobPattern(filePath: string, pattern: string): boolean {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*\*/g, '§DOUBLESTAR§')
      .replace(/\*/g, '[^/]*')
      .replace(/§DOUBLESTAR§/g, '.*')
      .replace(/\?/g, '[^/]')
      .replace(/\./g, '\\.');

    return new RegExp(`^${regexPattern}$`, 'i').test(filePath);
  }
}
