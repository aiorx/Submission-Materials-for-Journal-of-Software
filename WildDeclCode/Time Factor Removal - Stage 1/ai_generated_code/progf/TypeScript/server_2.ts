/**
 * Server-side i18n configuration
 * This module initializes i18next for server components
 *
 * Supported via standard GitHub programming aids
 */

var createInstance = require('i18next').createInstance;
var initReactI18next = require('react-i18next').initReactI18next;
var resourcesToBackend = require('i18next-resources-to-backend');
import {
  DEFAULT_NAMESPACE,
  ALL_NAMESPACES,
  getDefaultLanguage,
  getSupportedLanguages,
} from "./settings";

/**
 * Interface for HTTP request with cookies
 */
interface RequestWithCookies {
  cookies?: {
    get(name: string): string | undefined;
  };
}

// Define language detection order for server
var serverLanguageDetectionOrder = [
  // Detect from cookies
  {
    name: "cookie",
    lookup: function (req: RequestWithCookies) {
      var found;
      if (req?.cookies) {
        var langCookie = req.cookies.get("i18next");
        if (langCookie) found = langCookie;
      }
      return found;
    },
  },
  // Fallback to default
  {
    name: "default",
    lookup: function () { return getDefaultLanguage(); },
  },
];

// Create a separate i18n instance for the server to avoid conflicts with client
var serverI18n = createInstance({
  debug: process.env.NODE_ENV === "development",
  supportedLngs: getSupportedLanguages(),
  fallbackLng: getDefaultLanguage(),
  lng: getDefaultLanguage(),
  fallbackNS: DEFAULT_NAMESPACE,
  defaultNS: DEFAULT_NAMESPACE,
  ns: ALL_NAMESPACES,
  // Disable cache for server components to ensure latest translations
  load: "all",
  preload: getSupportedLanguages(),
  // Server component rendering is stateless so we don't cache
  interpolation: {
    escapeValue: false,
  },
  // Detect language on server
  detection: {
    order: serverLanguageDetectionOrder.map(function (d) { return d.name; }),
    lookupCookie: "i18next",
    caches: [],
  },
});

// Initialize with React i18next for server
serverI18n
  .use(initReactI18next)
  .use(
    resourcesToBackend(function (language: string, namespace: string) {
      // Load translations from public/locales
      return import("../../public/locales/" + (language) + "/" + (namespace) + ".json");
    })
  )
  .init({
    // Ensure we don't initialize during SSR multiple times
    initImmediate: true,
  });

/**
 * Get translation function for server components
 *
 * @param lng - Language to use for translations
 * @param ns - Namespace to use for translations
 * @returns Initialized translation function
 */
export async function getServerTranslation(
  lng: string = getDefaultLanguage(),
  ns: string | string[] = DEFAULT_NAMESPACE
) {
  await serverI18n.changeLanguage(lng);

  // Return the t function with type support
  return {
    t: serverI18n.getFixedT(lng, ns),
    i18n: serverI18n,
  };
}

module.exports = serverI18n;
