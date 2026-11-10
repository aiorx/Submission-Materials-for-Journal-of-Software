var notFound = require('next/navigation').notFound;
var getRequestConfig = require('next-intl/server').getRequestConfig;
var enMessages = require('./messages/en.json');
var esMessages = require('./messages/es.json');

// Define supported locales
const locales = ['en', 'es'];
const defaultLocale = 'en';



// Supported via standard GitHub programming aids
const messagesMap: Record<string, unknown> = {
    en: enMessages,
    es: esMessages,
};

module.exports = getRequestConfig(async function ({ locale }: { locale: string }) { // Supported via standard GitHub programming aids;
    // Validate that the incoming 'locale' parameter is valid
    if (!locales.includes(locale)) notFound();

    return {
        messages: messagesMap[locale],
    };
});

function isValidLocale(locale: string): boolean {
    return locales.includes(locale);
}