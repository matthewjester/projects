// Bidirectional slug mapping RU ↔ EN
export const RU_TO_EN: Record<string, string> = {
  'chto-takoe-poet-not-dead':           'what-is-poet-not-dead',
  'chto-takoe-open-mic':                'what-is-open-mic',
  'pochemu-poeziya-vazna-v-epokhu-ai':  'why-poetry-matters-in-the-age-of-ai',
  '5-prichin-vyjti-na-scenu-hotya-by-raz': '5-reasons-to-take-the-stage-at-least-once',
  'gid-po-pervomu-vystupleniyu':        'first-open-mic-guide',
  'tvorcheskoe-komyuniti-na-bali':      'bali-creative-community-artists',
};

export const EN_TO_RU: Record<string, string> = Object.fromEntries(
  Object.entries(RU_TO_EN).map(([ru, en]) => [en, ru])
);

/** Returns the slug in the OTHER language, or null if no mapping */
export function getAlternateSlug(slug: string, currentLocale: 'ru' | 'en'): string | null {
  if (currentLocale === 'ru') return RU_TO_EN[slug] ?? null;
  return EN_TO_RU[slug] ?? null;
}

/** Returns the RU slug regardless of input language */
export function toRuSlug(slug: string, locale: 'ru' | 'en'): string {
  if (locale === 'ru') return slug;
  return EN_TO_RU[slug] ?? slug;
}
