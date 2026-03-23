import type {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/factory', '/*/factory'],
      },
      // Allow all major AI/LLM crawlers explicitly
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'YouBot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'YandexBot', allow: '/' },
    ],
    sitemap: 'https://poetnotdead.com/sitemap.xml',
  };
}
