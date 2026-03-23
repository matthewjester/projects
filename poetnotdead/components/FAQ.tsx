'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';
import ScrollReveal from './ScrollReveal';

export default function FAQ() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = [
    {q: t('q1'), a: t('a1')},
    {q: t('q2'), a: t('a2')},
    {q: t('q3'), a: t('a3')},
    {q: t('q4'), a: t('a4')},
    {q: t('q5'), a: t('a5')},
    {q: t('q6'), a: t('a6')},
    {q: t('q7'), a: t('a7')},
  ];

  return (
    <section id="faq">
      <div className="c">
        <ScrollReveal>
          <h2 className="st">{t('title')}</h2>
        </ScrollReveal>
        <div className="fql">
          {items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="fqi">
                <button
                  className="fqb"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className={`fxi ${openIndex === i ? 'open' : ''}`}>+</span>
                </button>
                <div className={`faw ${openIndex === i ? 'open' : ''}`}>
                  <p>{item.a}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
