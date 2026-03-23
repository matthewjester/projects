'use client';

import {useTranslations} from 'next-intl';
import {usePathname} from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const lang = useTranslations()('lang');
  const pathname = usePathname();

  const currentLocale = lang === 'EN' ? 'ru' : 'en';
  const isHomePage = pathname === '/';

  const navHref = (anchor: string) =>
    isHomePage ? `#${anchor}` : `/${currentLocale}#${anchor}`;

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { anchor: 'about',   label: nav('about') },
    { anchor: 'mission', label: nav('mission') },
    { anchor: 'reviews', label: nav('reviews') },
    { anchor: 'events',  label: nav('events') },
    { anchor: 'blog',    label: nav('blog') },
    { anchor: 'faq',     label: nav('faq') },
    { anchor: 'contact', label: nav('contact') },
  ];

  const socials = [
    { href: 'https://t.me/poetnotdead/',                    label: 'Telegram' },
    { href: 'https://www.instagram.com/poetnotdead',         label: 'Instagram' },
    { href: 'https://youtube.com/@poetnotdead',              label: 'YouTube' },
    { href: 'https://facebook.com/poetnotdead',              label: 'Facebook' },
    { href: 'https://www.tiktok.com/@poetsnotdead',          label: 'TikTok' },
    { href: 'https://www.threads.com/@poetnotdead',          label: 'Threads' },
    { href: 'https://x.com/poetnotdead',                     label: 'X' },
  ];

  return (
    <footer>
      <div className="c">
        <div className="fg">
          <div>
            <a
              href={`/${currentLocale}`}
              className="brand"
              onClick={handleLogoClick}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <span className="r">Poet</span>{' '}
              <span className="w">Not Dead</span>
            </a>
            <p className="fbs">{t('slogan')}</p>
          </div>
          <div>
            <h4 className="fhd">{t('nav')}</h4>
            <div className="fls">
              {navItems.map((item) => (
                <a key={item.anchor} href={navHref(item.anchor)}>{item.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="fhd">{t('social')}</h4>
            <div className="fls">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="fhd">{t('contactTitle')}</h4>
            <span
              style={{ color: 'var(--txm)', fontSize: '.9rem', cursor: 'pointer' }}
              onClick={() => {
                window.location.href = 'mai' + 'lto:' + 'poetnotdead' + '@' + 'gmail.com';
              }}
            >
              poetnotdead@gmail.com
            </span>
          </div>
          <div>
            <h4 className="fhd">{t('legal')}</h4>
            <div className="fls">
              <a href={`/${currentLocale}/privacy`}>{t('privacy')}</a>
              <a href={`/${currentLocale}/terms`}>{t('terms')}</a>
            </div>
          </div>
        </div>
        <div className="fbt">{t('copyright')}</div>
      </div>
    </footer>
  );
}
