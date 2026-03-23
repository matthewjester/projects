'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

export default function Events() {
  const t = useTranslations('events');

  return (
    <section id="events">
      <div className="c">
        <ScrollReveal>
          <h2 className="st">{t('title')}</h2>
        </ScrollReveal>
        <div className="eg">
          <ScrollReveal delay={0.15}>
            <a
              href="https://www.instagram.com/reel/DV8CDbdk6Hl/?igsh=eDZyNDZ5b2M0MDY2"
              target="_blank"
              rel="noopener noreferrer"
              className="ec"
            >
              <div className="et">
                <Image
                  src="/images/events/event-22mar.jpg"
                  alt="Poet Not Dead Open Mic 22 March"
                  width={400}
                  height={300}
                  style={{width: '100%', height: 'auto'}}
                />
                <div className="py"></div>
              </div>
              <div className="ei">
                <h3>{t('event1Title')}</h3>
                <p>{t('event1Desc')}</p>
                <span className="el">{t('watchOn')}</span>
              </div>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
