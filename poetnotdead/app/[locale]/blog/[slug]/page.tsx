import { getBlogPost, getAllBlogSlugs } from '@/lib/notion';
import { getAlternateSlug, toRuSlug } from '@/lib/slug-map';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotionRenderer, { TableOfContents } from '@/components/NotionRenderer';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs();
    return slugs.map(({ slug, lang }) => ({ locale: lang, slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = locale === 'ru' ? 'RU' : 'EN';

  try {
    const post = await getBlogPost(slug, lang);
    if (!post) return {};

    return {
      title: `${post.title} — Poet Not Dead`,
      description: post.excerpt,
      keywords: post.tags.join(', '),
      alternates: (() => {
        const currentLocale = locale as 'ru' | 'en';
        // ruSlug is always the Russian slug
        const ruSlug = toRuSlug(slug, currentLocale);
        // enSlug: if on EN page use current slug, if on RU page look up the EN equivalent
        const enSlug = currentLocale === 'en' ? slug : getAlternateSlug(slug, 'ru');
        return {
          canonical: `/${locale}/blog/${slug}`,
          languages: {
            ru: `/ru/blog/${ruSlug}`,
            ...(enSlug ? { en: `/en/blog/${enSlug}` } : {}),
            'x-default': `https://poetnotdead.com/ru/blog/${ruSlug}`,
          },
        };
      })(),
      openGraph: {
        title: `${post.title} — Poet Not Dead`,
        description: post.excerpt,
        url: `https://poetnotdead.com/${locale}/blog/${slug}`,
        siteName: 'Poet Not Dead',
        locale: locale === 'ru' ? 'ru_RU' : 'en_US',
        type: 'article',
        publishedTime: post.date,
        tags: post.tags,
        images: post.cover ? [{ url: post.cover, width: 1200, height: 630 }] : [{ url: '/images/og-image.png', width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${post.title} — Poet Not Dead`,
        description: post.excerpt,
        images: post.cover ? [post.cover] : ['/images/og-image.png'],
      },
    };
  } catch {
    return {};
  }
}

export const revalidate = 3600;

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = locale === 'ru' ? 'RU' : 'EN';

  let post;
  try {
    post = await getBlogPost(slug, lang);
  } catch {
    notFound();
  }

  if (!post) notFound();

  const isRu = locale === 'ru';

  // BlogPosting schema.org
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'Poet Not Dead',
      url: 'https://poetnotdead.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Poet Not Dead',
      logo: { '@type': 'ImageObject', url: 'https://poetnotdead.com/images/logo.png' },
    },
    image: post.cover || 'https://poetnotdead.com/images/og-image.png',
    url: `https://poetnotdead.com/${locale}/blog/${slug}`,
    keywords: post.tags.join(', '),
    inLanguage: locale,
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <div className="c" style={{ maxWidth: '760px' }}>
          <nav style={{ marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--txm)' }}>
            <a href={`/${locale}`}>Home</a>
            {' / '}
            <a href={`/${locale}/blog`}>{isRu ? 'Блог' : 'Blog'}</a>
            {' / '}
            <span>{post.title}</span>
          </nav>

          {post.cover && (
            <img
              src={post.cover}
              alt={post.title}
              style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '12px', marginBottom: '2rem' }}
            />
          )}

          <time style={{ color: 'var(--txm)', fontSize: '0.9rem' }}>{post.date}</time>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', margin: '0.5rem 0 1.5rem' }}>{post.title}</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--txm)', borderLeft: '3px solid var(--ac)', paddingLeft: '1rem', marginBottom: '2rem' }}>
            {post.excerpt}
          </p>

          {post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {post.tags.map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <TableOfContents blocks={post.content} locale={locale} />
          <NotionRenderer blocks={post.content} />

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <a href={`/${locale}/blog`} style={{ color: 'var(--ac)' }}>
              ← {isRu ? 'Все статьи' : 'All articles'}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
