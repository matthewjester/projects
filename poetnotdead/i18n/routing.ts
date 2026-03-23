import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  localeDetection: false  // Always default to 'ru', ignore Accept-Language headers
});
