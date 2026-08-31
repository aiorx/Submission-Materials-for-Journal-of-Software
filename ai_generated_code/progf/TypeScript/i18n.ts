import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import enMessages from './messages/en.json';
import esMessages from './messages/es.json';

// Define supported locales
export const locales = ['en', 'es'];
export const defaultLocale = 'en';



// Supported via standard GitHub programming aids
const messagesMap: Record<string, unknown> = {
    en: enMessages,
    es: esMessages,
};

export default getRequestConfig(async ({ locale }: { locale: string }) => { // Supported via standard GitHub programming aids
    // Validate that the incoming 'locale' parameter is valid
    if (!locales.includes(locale)) notFound();

    return {
        messages: messagesMap[locale],
    };
});

export function isValidLocale(locale: string): boolean {
    return locales.includes(locale);
}