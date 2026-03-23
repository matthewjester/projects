'use client';

import {useTranslations, useLocale} from 'next-intl';
import {useEffect, useRef, useState, RefObject} from 'react';

const SCROLL_SETTLE_MS = 700;

function useReveal(delay: number, locale: string): {
  ref: RefObject<HTMLDivElement | null>;
  visible: boolean;
} {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setVisible(false);
    let done = false;
    let obs: IntersectionObserver | null = null;
    const timer = setTimeout(() => {
      obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !done) {
          done = true;
          obs?.disconnect();
          setVisible(true);
        }
      }, {threshold: 0.2});
      if (ref.current) obs.observe(ref.current);
    }, SCROLL_SETTLE_MS);
    return () => { clearTimeout(timer); obs?.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return {ref, visible};
}

function useRevealH2(locale: string): {
  ref: RefObject<HTMLHeadingElement | null>;
  visible: boolean;
} {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setVisible(false);
    let done = false;
    let obs: IntersectionObserver | null = null;
    const timer = setTimeout(() => {
      obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !done) {
          done = true;
          obs?.disconnect();
          setVisible(true);
        }
      }, {threshold: 0.2});
      if (ref.current) obs.observe(ref.current);
    }, SCROLL_SETTLE_MS);
    return () => { clearTimeout(timer); obs?.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return {ref, visible};
}

function revealStyle(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: visible ? `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s` : 'none',
  };
}

export default function Manifest() {
  const t = useTranslations('manifest');
  const locale = useLocale();

  const title = useRevealH2(locale);
  const h1a = useReveal(0.00, locale);
  const h1b = useReveal(0.15, locale);
  const h1c = useReveal(0.30, locale);
  const b0  = useReveal(0.45, locale);
  const b1  = useReveal(0.57, locale);
  const b2  = useReveal(0.69, locale);
  const b3  = useReveal(0.81, locale);
  const b4  = useReveal(0.93, locale);
  const b5  = useReveal(1.05, locale);
  const b6  = useReveal(1.17, locale);
  const b7  = useReveal(1.29, locale);
  const b8  = useReveal(1.41, locale);
  const h2a = useReveal(1.53, locale);
  const h2b = useReveal(1.68, locale);
  const h2c = useReveal(1.83, locale);

  const headerLines = [t('line1'), t('line2'), t('line3')];
  const bodyLines   = [t('body1'), t('body2'), t('body3'), t('body4'), t('body5'), t('body6'), t('body7'), t('body8'), t('body9')];
  const h1 = [h1a, h1b, h1c];
  const b  = [b0, b1, b2, b3, b4, b5, b6, b7, b8];
  const h2 = [h2a, h2b, h2c];

  return (
    <section id="manifest">
      <div className="c">
        <h2
          ref={title.ref}
          className="st"
          style={{
            opacity: title.visible ? 1 : 0,
            transform: title.visible ? 'translateY(0)' : 'translateY(30px)',
            transition: title.visible ? 'opacity 0.6s ease, transform 0.6s ease' : 'none',
          }}
        >
          {t('title')}
        </h2>
        <div className="ml">
          {headerLines.map((line, i) => (
            <div key={`h1-${i}`} ref={h1[i].ref} className="mn mh" style={revealStyle(h1[i].visible, i * 0.15)}>
              {line}
            </div>
          ))}
          {bodyLines.map((line, i) => (
            <div key={`b-${i}`} ref={b[i].ref} className="mn mn-n" style={revealStyle(b[i].visible, 0.45 + i * 0.12)}>
              {line}
            </div>
          ))}
          {headerLines.map((line, i) => (
            <div key={`h2-${i}`} ref={h2[i].ref} className="mn mh" style={revealStyle(h2[i].visible, 1.53 + i * 0.15)}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
