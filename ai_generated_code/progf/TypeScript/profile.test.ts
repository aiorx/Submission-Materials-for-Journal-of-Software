// Assisted using common GitHub development utilities
/**
 * Tests for profile command
 */
import { jest } from '@jest/globals';
import * as fs from 'fs-extra';
import { profileCommand } from '../../cli/commands/profile.js';

// Mock dependencies
jest.mock('fs-extra');
jest.mock('../../core/config.js');

describe('Profile Command', () => {
  let mockFs: jest.Mocked<typeof fs>;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    mockFs = fs as jest.Mocked<typeof fs>;
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Setup default mocks
    mockFs.pathExists = jest.fn().mockResolvedValue(true);
    mockFs.readJSON = jest.fn().mockResolvedValue({
      name: 'test-profile',
      version: '1.0.0',
      rules: []
    });
    mockFs.writeJSON = jest.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('Profile Listing', () => {
    it('should list available profiles', async () => {
      mockFs.readdir = jest.fn().mockResolvedValue(['default.json', 'typescript.json']);
      
      await profileCommand({ action: 'list' });
      
      expect(mockFs.readdir).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should handle empty profiles directory', async () => {
      mockFs.readdir = jest.fn().mockResolvedValue([]);
      
      await profileCommand({ action: 'list' });
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No profiles found'));
    });
  });

  describe('Profile Creation', () => {
    it('should create new profile', async () => {
      await profileCommand({ 
        action: 'create', 
        name: 'new-profile' 
      });
      
      expect(mockFs.writeJSON).toHaveBeenCalled();
    });

    it('should prevent overwriting existing profile without force', async () => {
      mockFs.pathExists = jest.fn().mockResolvedValue(true);
      
      await profileCommand({ 
        action: 'create', 
        name: 'existing-profile' 
      });
      
      // Should not overwrite
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('already exists'));
    });

    it('should overwrite with force option', async () => {
      mockFs.pathExists = jest.fn().mockResolvedValue(true);
      
      await profileCommand({ 
        action: 'create', 
        name: 'existing-profile',
        force: true 
      });
      
      expect(mockFs.writeJSON).toHaveBeenCalled();
    });
  });

  describe('Profile Validation', () => {
    it('should validate profile structure', async () => {
      await profileCommand({ 
        action: 'validate', 
        name: 'test-profile' 
      });
      
      expect(mockFs.readJSON).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('valid'));
    });

    it('should detect invalid profile structure', async () => {
      mockFs.readJSON = jest.fn().mockResolvedValue({ invalid: 'structure' });
      
      await profileCommand({ 
        action: 'validate', 
        name: 'invalid-profile' 
      });
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('invalid'));
    });
  });

  describe('Profile Details', () => {
    it('should show profile details', async () => {
      const mockProfile = {
        name: 'typescript',
        version: '1.0.0',
        settings: { output_format: 'json' },
        rules: [{ name: 'no-console', enabled: true }]
      };
      mockFs.readJSON = jest.fn().mockResolvedValue(mockProfile);
      
      await profileCommand({ 
        action: 'show', 
        name: 'typescript' 
      });
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('typescript'));
    });
  });

  describe('Error Handling', () => {
    it('should handle missing profile file', async () => {
      mockFs.pathExists = jest.fn().mockResolvedValue(false);
      
      await profileCommand({ 
        action: 'show', 
        name: 'nonexistent' 
      });
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));
    });

    it('should handle file read errors', async () => {
      mockFs.readJSON = jest.fn().mockRejectedValue(new Error('Permission denied'));
      
      await profileCommand({ 
        action: 'show', 
        name: 'test' 
      });
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error'));
    });
  });
});
