'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

export default function Reviews() {
  const t = useTranslations('reviews');

  return (
    <section id="reviews">
      <div className="c">
        <ScrollReveal>
          <h2 className="st">{t('title')}</h2>
        </ScrollReveal>
        <div className="rg">
          <ScrollReveal delay={0.2}>
            <div className="rc">
              <Image
                className="rph"
                src="/images/reviews/sofia.jpg"
                alt="Sofia Selina"
                width={160}
                height={160}
              />
              <p className="rtx">&ldquo;{t('sofia')}&rdquo;</p>
              <p className="rnm">
                <a
                  href="https://www.instagram.com/selinaplus"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sofia Selina
                </a>
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <div className="rc">
              <Image
                className="rph"
                src="/images/reviews/ilona.jpg"
                alt="Ilona Chin"
                width={160}
                height={160}
              />
              <p className="rtx">&ldquo;{t('ilona')}&rdquo;</p>
              <p className="rnm">
                <a
                  href="https://www.instagram.com/ilonessa"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ilona Chin
                </a>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
