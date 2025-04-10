export const supportedLocales = ['en', 'fr'] as const;

export type Locale = typeof supportedLocales[number];
