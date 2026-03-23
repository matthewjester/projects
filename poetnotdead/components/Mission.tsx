'use client';

import {useTranslations} from 'next-intl';
import ScrollReveal from './ScrollReveal';

export default function Mission() {
  const t = useTranslations('mission');

  const cards = [
    {key: 'freedom', title: t('freedom'), desc: t('freedomDesc')},
    {key: 'inspiration', title: t('inspiration'), desc: t('inspirationDesc')},
    {key: 'healing', title: t('healing'), desc: t('healingDesc')},
    {key: 'community', title: t('community'), desc: t('communityDesc')},
  ];

  return (
    <section id="mission">
      <div className="c">
        <ScrollReveal>
          <h2 className="st">{t('title')}</h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className="ms">{t('subtitle')}</p>
        </ScrollReveal>
        <div className="pl">
          {cards.map((card, i) => (
            <ScrollReveal key={card.key} delay={i * 0.1}>
              <div className="pi">
                <div className="pi-i">&#9670;</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
