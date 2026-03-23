'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {useState, useMemo} from 'react';
import {getAlternateSlug} from '@/lib/slug-map';

export default function Header() {
  const t = useTranslations('nav');
  const lang = useTranslations()('lang');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // lang = label of the OTHER language (e.g. if current=ru → lang='EN')
  const currentLocale = lang === 'EN' ? 'ru' : 'en';
  const isHomePage = pathname === '/';

  const navAnchors = [
    { anchor: 'about',    label: t('about') },
    { anchor: 'mission',  label: t('mission') },
    { anchor: 'manifest', label: t('manifest') },
    { anchor: 'reviews',  label: t('reviews') },
    { anchor: 'events',   label: t('events') },
    { anchor: 'blog',     label: t('blog') },
    { anchor: 'faq',      label: t('faq') },
    { anchor: 'contact',  label: t('contact') },
  ];

  // On home page → relative anchor (no reload, smooth scroll)
  // On other pages → full path to home + anchor
  const navHref = (anchor: string) =>
    isHomePage ? `#${anchor}` : `/${currentLocale}#${anchor}`;

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const otherLocale = lang === 'EN' ? 'en' : 'ru';

  // On blog article pages, swap slug for the other language
  const switchHref = useMemo(() => {
    const blogMatch = pathname.match(/^\/blog\/(.+)$/);
    if (blogMatch) {
      const slug = blogMatch[1];
      const altSlug = getAlternateSlug(slug, currentLocale as 'ru' | 'en');
      if (altSlug) return `/blog/${altSlug}`;
      return '/blog'; // no pair → blog list
    }
    return pathname || '/';
  }, [pathname, currentLocale]);

  return (
    <>
      <header>
        <div className="c hi">
          <a
            href={`/${currentLocale}`}
            className="brand"
            onClick={handleLogoClick}
            style={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            <span className="r">Poet</span>{' '}
            <span className="w">Not Dead</span>
          </a>
          <nav className="nd">
            {navAnchors.map((item) => (
              <a key={item.anchor} href={navHref(item.anchor)}>{item.label}</a>
            ))}
          </nav>
          <div className="hr">
            <Link href={switchHref} locale={otherLocale} className="ls">
              {lang}
            </Link>
            <button
              className="bur"
              aria-label="Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
      <nav className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        {navAnchors.map((item) => (
          <a
            key={item.anchor}
            href={navHref(item.anchor)}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </>
  );
}
