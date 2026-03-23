// Notion API 2022-06-28 — direct HTTP (SDK v5.9 has breaking changes)

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const NOTION_VERSION = '2022-06-28';
const BLOG_DATABASE_ID = '30ca74b6-51a8-8100-b14d-eb13b0412812';

export { BLOG_DATABASE_ID };

const headers = () => ({
  'Authorization': `Bearer ${NOTION_API_KEY}`,
  'Notion-Version': NOTION_VERSION,
  'Content-Type': 'application/json',
});

async function notionFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: { ...headers(), ...(options.headers as any) },
    cache: 'no-store',
  } as any);
  return res.json();
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  lang: 'RU' | 'EN';
  status: string;
  date: string;
  excerpt: string;
  tags: string[];
  cover: string | null;
}

export interface BlogPostWithContent extends BlogPost {
  content: any[];
}

function getRichText(prop: any): string {
  return prop?.rich_text?.[0]?.plain_text ?? '';
}

function getSelect(prop: any): string {
  return prop?.select?.name ?? '';
}

function getMultiSelect(prop: any): string[] {
  return prop?.multi_select?.map((o: any) => o.name) ?? [];
}

function getDate(prop: any): string {
  return prop?.date?.start ?? '';
}

function getTitle(prop: any): string {
  return prop?.title?.[0]?.plain_text ?? '';
}

function getUrl(prop: any): string | null {
  return prop?.url ?? null;
}

function pageToPost(page: any): BlogPost {
  const p = page.properties ?? {};
  return {
    id: page.id,
    title: getTitle(p.Title),
    slug: getRichText(p.Slug),
    lang: getSelect(p.Lang) as 'RU' | 'EN',
    status: getSelect(p.Status),
    date: getDate(p.Date),
    excerpt: getRichText(p.Excerpt),
    tags: getMultiSelect(p.Tags),
    cover: getUrl(p.Cover),
  };
}

export async function getBlogPosts(lang?: 'RU' | 'EN'): Promise<BlogPost[]> {
  const filterConditions: any[] = [
    { property: 'Status', select: { equals: 'Published' } },
  ];
  if (lang) {
    filterConditions.push({ property: 'Lang', select: { equals: lang } });
  }

  const data = await notionFetch(`/databases/${BLOG_DATABASE_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: { and: filterConditions },
      sorts: [{ property: 'Date', direction: 'descending' }],
    }),
  });

  return (data.results ?? []).map(pageToPost);
}

export async function getBlogPost(slug: string, lang: 'RU' | 'EN'): Promise<BlogPostWithContent | null> {
  const data = await notionFetch(`/databases/${BLOG_DATABASE_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Slug', rich_text: { equals: slug } },
          { property: 'Lang', select: { equals: lang } },
          { property: 'Status', select: { equals: 'Published' } },
        ],
      },
    }),
  });

  if (!data.results?.length) return null;
  const page = data.results[0];

  const blocks = await notionFetch(`/blocks/${page.id}/children?page_size=100`);

  return {
    ...pageToPost(page),
    content: blocks.results ?? [],
  };
}

export async function getAllBlogSlugs(): Promise<{ slug: string; lang: string; date: string }[]> {
  const data = await notionFetch(`/databases/${BLOG_DATABASE_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: { property: 'Status', select: { equals: 'Published' } },
    }),
  });

  return (data.results ?? [])
    .map((page: any) => ({
      slug: getRichText(page.properties?.Slug),
      lang: (getSelect(page.properties?.Lang) || 'RU').toLowerCase(),
      date: getDate(page.properties?.Date) || '',
    }))
    .filter((item: any) => item.slug);
}
