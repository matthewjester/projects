'use client';

import {useTranslations} from 'next-intl';
import {useLocale} from 'next-intl';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

const SLUGS_RU = [
  'chto-takoe-poet-not-dead',
  'chto-takoe-open-mic',
  'pochemu-poeziya-vazna-v-epokhu-ai',
  '5-prichin-vyjti-na-scenu-hotya-by-raz',
  'gid-po-pervomu-vystupleniyu',
  'tvorcheskoe-komyuniti-na-bali',
];

const SLUGS_EN = [
  'what-is-poet-not-dead',
  'what-is-open-mic',
  'why-poetry-matters-in-the-age-of-ai',
  '5-reasons-to-take-the-stage-at-least-once',
  'first-open-mic-guide',
  'bali-creative-community-artists',
];

export default function Blog() {
  const t = useTranslations('blog');
  const locale = useLocale();

  const SLUGS = locale === 'en' ? SLUGS_EN : SLUGS_RU;
  const posts = [
    {title: t('post1Title'), desc: t('post1Desc'), date: t('post1Date'), slug: SLUGS[0]},
    {title: t('post2Title'), desc: t('post2Desc'), date: t('post2Date'), slug: SLUGS[1]},
    {title: t('post3Title'), desc: t('post3Desc'), date: t('post3Date'), slug: SLUGS[2]},
    {title: t('post4Title'), desc: t('post4Desc'), date: t('post4Date'), slug: SLUGS[3]},
    {title: t('post5Title'), desc: t('post5Desc'), date: t('post5Date'), slug: SLUGS[4]},
    {title: t('post6Title'), desc: t('post6Desc'), date: t('post6Date'), slug: SLUGS[5]},
  ];

  return (
    <section id="blog">
      <div className="c">
        <ScrollReveal>
          <h2 className="st">{t('title')}</h2>
        </ScrollReveal>
        <div className="blg">
          {posts.map((post, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <Link href={`/${locale}/blog/${post.slug}`} className="bc">
                <div className="bcb">
                  <time>{post.date}</time>
                  <h3>{post.title}</h3>
                  <p>{post.desc}</p>
                  <span className="rm">{t('readMore')}</span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
