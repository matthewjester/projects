import { getBlogPosts } from '@/lib/notion';
import { setRequestLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
  return [{locale: 'ru'}, {locale: 'en'}];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const title = isRu ? 'Блог — Poet Not Dead' : 'Blog — Poet Not Dead';
  const description = isRu
    ? 'Статьи о поэзии, open mic, творчестве и жизни на Бали'
    : 'Articles about poetry, open mic, creativity and life in Bali';
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { ru: '/ru/blog', en: '/en/blog', 'x-default': 'https://poetnotdead.com/ru/blog' },
    },
    openGraph: {
      title,
      description,
      url: `https://poetnotdead.com/${locale}/blog`,
      siteName: 'Poet Not Dead',
      locale: isRu ? 'ru_RU' : 'en_US',
      type: 'website',
      images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Poet Not Dead' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og-image.png'],
    },
  };
}

export const revalidate = 3600; // ISR: обновлять каждый час

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  let posts: import('@/lib/notion').BlogPost[] = [];
  try {
    posts = await getBlogPosts(isRu ? 'RU' : 'EN');
  } catch (e) {
    // Notion not available — show empty state
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <div className="c">
          <h1 className="st" style={{ marginBottom: '2rem' }}>
            {isRu ? 'Блог' : 'Blog'}
          </h1>
          {posts.length === 0 ? (
            <p style={{ color: 'var(--txm)', textAlign: 'center', padding: '4rem 0' }}>
              {isRu ? 'Статьи скоро появятся' : 'Articles coming soon'}
            </p>
          ) : (
            <div className="blg">
              {posts.map((post) => (
                <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="bc">
                  <div className="bcb">
                    {post.cover && (
                      <img
                        src={post.cover}
                        alt={post.title}
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px 8px 0 0', marginBottom: '1rem' }}
                      />
                    )}
                    <time>{post.date}</time>
                    <h2 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>{post.title}</h2>
                    <p>{post.excerpt}</p>
                    <span className="rm">{isRu ? 'Читать далее →' : 'Read more →'}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
