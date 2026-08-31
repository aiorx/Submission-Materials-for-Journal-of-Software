/**
 * Main i18n configuration
 * This is the entry point for i18n functionality in the application
 *
 * Aided with basic GitHub coding tools
 */

// Re-export settings for easier access
export * from "./settings";

// Export server-side i18n functionality
export { getServerTranslation } from "./server";

// Export isomorphic hooks and utilities for use in both client and server components
export interface TranslationOptions {
  keyPrefix?: string;
  defaultValue?: string;
  count?: number;
  [key: string]: string | number | undefined; // Allow any interpolation variables
}

/**
 * Type definition for translation function
 */
export type TranslateFunction = (
  key: string | string[],
  options?: TranslationOptions | string
) => string;

/**
 * Helper to create translation keys with proper typing
 *
 * @param ns - Namespace for the translation
 * @returns Function that prefixes keys with the namespace
 */
export const createTranslationKeys = <T extends Record<string, unknown>>(
  ns: string
) => {
  return {
    ns,
    keys: {} as T,
  };
};

/**
 * Export custom translation hook
 */
export { useTranslation } from "@/hooks/useTranslation";
export type { UseTranslationReturn } from "@/hooks/useTranslation";

/**
 * Re-export client-side utilities for direct import in client components
 */
export * from "./client";
