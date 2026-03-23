'use client';

import {useLocale} from 'next-intl';
import {useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * ScrollReveal — fade+slide animation on viewport entry.
 * Uses pure CSS transitions + IntersectionObserver (no framer-motion).
 * On locale change the effect re-runs: resets visibility and recreates observer
 * so animations replay correctly on /ru ↔ /en soft navigation.
 */
export default function ScrollReveal({children, delay = 0, className}: Props) {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reset to hidden immediately
    setVisible(false);

    let done = false;
    let observer: IntersectionObserver | null = null;

    // Delay observer creation by 700ms — lets Next.js finish scroll-to-top
    // before we start watching for intersections. Without this delay, elements
    // briefly pass through the viewport during the scroll animation and fire
    // before the locale reset takes visual effect.
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !done) {
            done = true;
            observer?.disconnect();
            setVisible(true);
          }
        },
        {threshold: 0.2}
      );
      if (ref.current) observer.observe(ref.current);
    }, 700);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  // Re-run on locale change only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: visible
          ? `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`
          : 'none',
      }}
    >
      {children}
    </div>
  );
}
