// src/i18n/utils.ts
import { supportedLocales, Locale } from './locales';

/**
 * Type guard to check if a given string is a valid Locale.
 * @param Locale - The locale string to validate.
 * @returns True if valid Locale, else False.
 */
export function isLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
}
