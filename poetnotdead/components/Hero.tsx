'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';
import {motion} from 'framer-motion';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section id="hero">
      <h1 className="sr-only">{t('h1')}</h1>
      <motion.div
        initial={{opacity: 0, scale: 0.92}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 1.2, ease: 'easeOut'}}
      >
        <Image
          className="hl"
          src="/images/logo.png"
          alt="Poet Not Dead"
          width={460}
          height={460}
          priority
        />
      </motion.div>
      <motion.div
        className="hb"
        initial={{opacity: 0, y: 15}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 1.2, ease: 'easeOut', delay: 0.8}}
      >
        <a
          href="https://t.me/poetnotdead/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-f"
        >
          {t('cta')}
        </a>
      </motion.div>
      <div className="si">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
          <path d="M7 13l5 5 5-5M7 7l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
