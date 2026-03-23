'use client';

import {useTranslations} from 'next-intl';
import ScrollReveal from './ScrollReveal';

export default function Contact() {
  const t = useTranslations('contact');

  const handleEmailClick = () => {
    window.location.href = 'mai' + 'lto:' + 'poetnotdead' + '@' + 'gmail.com';
  };

  return (
    <section id="contact">
      <div className="c cc">
        <ScrollReveal>
          <h2 className="st">{t('title')}</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <span className="ce" onClick={handleEmailClick}>
            poetnotdead@gmail.com
          </span>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="cb">
            <a
              href="https://t.me/poetnotdead/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-f"
            >
              {t('join')}
            </a>
            <a
              href="https://t.me/poetsnotdead/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              {t('investors')}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
