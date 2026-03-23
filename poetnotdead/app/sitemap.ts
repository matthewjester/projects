import type {MetadataRoute} from 'next';
import { getAllBlogSlugs } from '@/lib/notion';

// Last major update of static pages (update when content changes)
const SITE_UPDATED = new Date('2026-02-19');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://poetnotdead.com';
  const locales = ['ru', 'en'];
  const pages = ['', '/privacy', '/terms'];

  const entries: MetadataRoute.Sitemap = [];

  // Main pages — use fixed last-updated date
  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: SITE_UPDATED,
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.5,
      });
    }
  }

  // Blog index — refreshes often
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: SITE_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Blog posts — use actual Notion article dates
  let publishedSlugs: { slug: string; lang: string; date: string }[] = [];
  try {
    publishedSlugs = await getAllBlogSlugs();
  } catch {
    // Fallback: empty (graceful degradation, sitemap still works for static pages)
    publishedSlugs = [];
  }

  for (const { slug, lang, date } of publishedSlugs) {
    if (!slug) continue;
    entries.push({
      url: `${baseUrl}/${lang}/blog/${slug}`,
      lastModified: date ? new Date(date) : SITE_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}
