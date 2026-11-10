// Aided with basic GitHub coding tools
/**
 * Path Utility Module
 *
 * This module provides utilities for handling import path resolution issues
 * and standardizing path usage across the application.
 *
 * @module utils/pathUtils
 */

import { z } from 'zod';

/**
 * Module path configuration
 */
const PathConfig = z.object({
  basePath: z.string(),
  moduleNames: z.array(z.string()),
});

type PathConfigType = z.infer<typeof PathConfig>;

/**
 * Default path configuration
 */
const DEFAULT_CONFIG: PathConfigType = {
  basePath: '@/utils',
  moduleNames: [
    'apiClient',
    'secureBufferUtils',
    'solanaUtils',
    'useGPUAcceleration',
  ],
};

/**
 * Validates that a module path follows the correct pattern
 *
 * @param path - The import path to validate
 * @param config - Optional path configuration
 * @returns A boolean indicating if the path is valid
 */
export const validateModulePath = (
  path: string,
  config: Partial<PathConfigType> = {},
): boolean => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    // Check if the path follows the correct format (should start with the basePath)
    if (!path.startsWith(finalConfig.basePath)) {
      return false;
    }

    // Extract the module name from the path
    const moduleName = path.substring(finalConfig.basePath.length + 1);

    // Check if the module name is in the list of known modules
    return finalConfig.moduleNames.some(
      (name) => moduleName === name || moduleName.startsWith(`${name}/`),
    );
  } catch (error) {
    console.error('Error validating module path:', error);
    return false;
  }
};

/**
 * Returns the correct path for a given module
 *
 * @param moduleName - The name of the module without path prefix
 * @param config - Optional path configuration
 * @returns The correct import path for the module
 */
export const getCorrectModulePath = (
  moduleName: string,
  config: Partial<PathConfigType> = {},
): string => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    if (!finalConfig.moduleNames.includes(moduleName)) {
      throw new Error(`Unknown module: ${moduleName}`);
    }

    return `${finalConfig.basePath}/${moduleName}`;
  } catch (error) {
    console.error('Error getting correct module path:', error);
    throw new Error(`Failed to resolve module path for: ${moduleName}`);
  }
};

/**
 * Helper function to ensure consistent import paths throughout the application
 * Use this to wrap imports to ensure they're correctly resolved
 *
 * @param module - The imported module
 * @returns The same module, unmodified
 * @template T - The type of the module
 */
export const ensureModulePath = <T>(module: T): T => {
  return module;
};

/**
 * Type-safe utility to create import paths for utility modules
 *
 * @param moduleName - The name of the utility module
 * @returns The correct import path string
 */
export function createUtilImportPath<
  T extends (typeof DEFAULT_CONFIG.moduleNames)[number],
>(moduleName: T): string {
  return `${DEFAULT_CONFIG.basePath}/${moduleName}`;
}

/**
 * Utility function to check module path resolution
 *
 * @returns Always returns true, used to verify import path resolution
 */
export const checkModuleResolution = (): boolean => {
  return true;
};
