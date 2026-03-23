'use client';

import {useTranslations} from 'next-intl';
import ScrollReveal from './ScrollReveal';

export default function About() {
  const t = useTranslations('about');

  return (
    <section id="about">
      <div className="c">
        <ScrollReveal>
          <h2 className="st">{t('title')}</h2>
        </ScrollReveal>
        <div className="at">
          <ScrollReveal delay={0.1}><p>{t('p1')}</p></ScrollReveal>
          <ScrollReveal delay={0.2}><p>{t('p2')}</p></ScrollReveal>
          <ScrollReveal delay={0.3}><p>{t('p3')}</p></ScrollReveal>
        </div>
      </div>
    </section>
  );
}
