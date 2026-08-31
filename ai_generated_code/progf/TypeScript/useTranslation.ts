/**
 * Custom useTranslation hook for Dashi
 * Provides type-safe translations and additional utilities
 *
 * Supported via standard GitHub programming aids
 */

"use client";

import { useTranslation as useI18nTranslation } from "react-i18next";
import { useCallback } from "react";
import { TranslateFunction, TranslationOptions } from "../lib/i18n/index";
import i18nClient, {
  changeLanguage as clientChangeLanguage,
} from "../lib/i18n/client";
import { LANGUAGES, getLanguageByCode } from "../lib/i18n/settings";

/**
 * Enhanced return type for the useTranslation hook
 */
export interface UseTranslationReturn {
  /**
   * Translation function for getting translated strings
   */
  t: TranslateFunction;

  /**
   * Current i18next instance
   */
  i18n: typeof i18nClient;

  /**
   * Current language code (e.g., 'en', 'fr')
   */
  currentLanguage: string;

  /**
   * Current language object with code, name, and flag
   */
  currentLanguageInfo:
    | {
        code: string;
        name: string;
        flag?: string;
      }
    | undefined;

  /**
   * List of available languages
   */
  availableLanguages: typeof LANGUAGES;

  /**
   * Function to change the current language
   */
  changeLanguage: (lng: string) => Promise<void>;

  /**
   * Function to check if text exists for a given key
   */
  exists: (key: string) => boolean;

  /**
   * Function to format a date according to the current locale
   */
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;

  /**
   * Function to format a number according to the current locale
   */
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;

  /**
   * Function to get a translated string with plural forms
   */
  plural: (key: string, count: number) => string;
}

/**
 * Custom hook for translations in Dashi
 * Enhances the react-i18next useTranslation hook with additional utilities
 *
 * @param ns - Optional namespace or array of namespaces
 * @returns Enhanced translation utilities
 */
export function useTranslation(ns?: string | string[]): UseTranslationReturn {
  const { t: originalT, i18n } = useI18nTranslation(ns);
  const currentLanguage = i18n.language || "en";
  const currentLanguageInfo = getLanguageByCode(currentLanguage);

  /**
   * Wrapped translation function to match our TranslateFunction type
   */
  const t: TranslateFunction = useCallback(
    (key: string | string[], options?: TranslationOptions | string) => {
      // Cast the original t function to accept our options type
      return (originalT as any)(key, options);
    },
    [originalT]
  );

  /**
   * Wrapped changeLanguage function that returns Promise<void> to match our interface
   */
  const changeLanguage = useCallback(async (lng: string): Promise<void> => {
    try {
      // Use the imported changeLanguage function but ensure we return void
      await clientChangeLanguage(lng);
    } catch (error) {
      console.error(`Failed to change language to ${lng}:`, error);
    }
  }, []);

  /**
   * Format a date according to the current locale
   */
  const formatDate = useCallback(
    (date: Date, options?: Intl.DateTimeFormatOptions) => {
      return date.toLocaleDateString(currentLanguage, options);
    },
    [currentLanguage]
  );

  /**
   * Format a number according to the current locale
   */
  const formatNumber = useCallback(
    (num: number, options?: Intl.NumberFormatOptions) => {
      return num.toLocaleString(currentLanguage, options);
    },
    [currentLanguage]
  );

  /**
   * Get a translated string with plural forms
   */
  const plural = useCallback(
    (key: string, count: number): string => {
      return t(key, { count });
    },
    [t]
  );

  /**
   * Check if a translation exists for a given key
   */
  const exists = useCallback(
    (key: string): boolean => {
      return i18n.exists(key);
    },
    [i18n]
  );

  return {
    t,
    i18n,
    currentLanguage,
    currentLanguageInfo,
    availableLanguages: LANGUAGES,
    changeLanguage,
    exists,
    formatDate,
    formatNumber,
    plural,
  };
}

/**
 * Default export for the useTranslation hook
 */
export default useTranslation;
