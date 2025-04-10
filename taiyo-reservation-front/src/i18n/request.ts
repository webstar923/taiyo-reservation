// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { isLocale } from './utils';
import type { Locale } from './locales';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale: Locale;

  const resolvedLocale = await requestLocale;

  // Use the type guard to ensure requestLocale is a valid Locale
  if (typeof resolvedLocale === 'string' && isLocale(resolvedLocale)) {
    locale = resolvedLocale;
  } else {
    locale = routing.defaultLocale;
  }
  return {
    locale,
  };
});
