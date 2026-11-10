/**
 * i18n settings configuration
 * Contains common i18n settings like supported languages and namespaces
 *
 * Supported via standard GitHub programming aids
 */

/**
 * Language configuration
 */
export interface Language {
  /** Language code (e.g., 'en', 'fr') */
  code: string;
  /** Display name in the language itself */
  name: string;
  /** Flag emoji or code for visual representation */
  flag?: string;
}

/**
 * Supported languages configuration
 */
var LANGUAGES: Language[] = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "fr",
    name: "Français",
    flag: "🇫🇷",
  },
];

/**
 * Default language code
 */
var DEFAULT_LANGUAGE = "en";

/**
 * Get supported language codes
 */
var LANGUAGE_CODES = LANGUAGES.map(function (lang) { return lang.code; });

/**
 * Translation namespaces configuration
 * Each namespace represents a logical grouping of translations
 */
var NAMESPACES = {
  COMMON: "common",
  AUTH: "auth",
  RESTAURANT: "restaurant",
  MENU: "menu",
  CART: "cart",
  ORDER: "order",
};

/**
 * Default namespace used when no namespace is specified
 */
var DEFAULT_NAMESPACE = NAMESPACES.COMMON;

/**
 * All namespaces array for initial loading
 */
var ALL_NAMESPACES = Object.values(NAMESPACES);

/**
 * Cache expiration time in days
 */
var CACHE_EXPIRATION_DAYS = 7;

/**
 * Get language configuration by code
 *
 * @param code - Language code
 * @returns Language configuration or undefined if not found
 */
function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find(function (lang) { return lang.code === code; });
}

/**
 * Check if a language code is supported
 *
 * @param code - Language code to check
 * @returns True if the language is supported
 */
function isLanguageSupported(code: string): boolean {
  return LANGUAGE_CODES.includes(code);
}

/**
 * Initialize language from environment variables if available
 *
 * @returns Default language from environment or fallback value
 */
function getDefaultLanguage(): string {
  return process.env.NEXT_PUBLIC_DEFAULT_LOCALE || DEFAULT_LANGUAGE;
}

/**
 * Get supported languages from environment variables if available
 *
 * @returns Array of supported language codes
 */
function getSupportedLanguages(): string[] {
  var envLocales = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES;
  if (envLocales) {
    return envLocales.split(",").map(function (locale) { return locale.trim(); });
  }
  return LANGUAGE_CODES;
}
