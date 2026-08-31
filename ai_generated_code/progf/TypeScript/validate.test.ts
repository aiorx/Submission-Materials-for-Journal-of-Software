// Assisted using common GitHub development utilities
/**
 * Tests for validate command
 */
import { jest } from '@jest/globals';
import * as fs from 'fs-extra';
import { validateCommand } from '../../cli/commands/validate.js';

// Mock dependencies
jest.mock('fs-extra');
jest.mock('../../core/config.js');

describe('Validate Command', () => {
  let consoleSpy: jest.SpyInstance<void, Parameters<typeof console.log>, typeof console>;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Setup default mocks
    (fs.pathExists as jest.MockedFunction<typeof fs.pathExists>) = jest.fn().mockResolvedValue(true);
    (fs.readJSON as jest.MockedFunction<typeof fs.readJSON>) = jest.fn().mockResolvedValue({
      name: 'test-profile',
      version: '1.0.0',
      rules: []
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('Configuration Validation', () => {
    it('should validate profile configuration', async () => {
      await validateCommand({ profile: 'typescript' });
      
      expect(fs.readJSON).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should detect missing required fields', async () => {
      (fs.readJSON as jest.MockedFunction<typeof fs.readJSON>) = jest.fn().mockResolvedValue({
        // Missing required fields
        version: '1.0.0'
      });
      
      await validateCommand({});
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('invalid'));
    });
  });

  describe('Rule Validation', () => {
    it('should validate individual rules', async () => {
      const profileWithRules = {
        name: 'test',
        version: '1.0.0',
        rules: [
          { name: 'valid-rule', enabled: true, severity: 'error' },
          { name: 'another-rule', enabled: false, severity: 'warning' }
        ]
      };
      (fs.readJSON as jest.MockedFunction<typeof fs.readJSON>) = jest.fn().mockResolvedValue(profileWithRules);
      
      await validateCommand({});
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('valid'));
    });

    it('should detect invalid rule configurations', async () => {
      const profileWithInvalidRules = {
        name: 'test',
        version: '1.0.0',
        rules: [
          { name: 'invalid-rule' } // Missing required fields
        ]
      };
      (fs.readJSON as jest.MockedFunction<typeof fs.readJSON>) = jest.fn().mockResolvedValue(profileWithInvalidRules);
      
      await validateCommand({});
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('error'));
    });
  });

  describe('Error Handling', () => {
    it('should handle missing profile file', async () => {
      (fs.pathExists as jest.MockedFunction<typeof fs.pathExists>) = jest.fn().mockResolvedValue(false);
      
      await validateCommand({ profile: 'nonexistent' });
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));
    });
  });
});
