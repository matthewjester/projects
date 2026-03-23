'use client';

import {useLocale} from 'next-intl';
import {ReactNode} from 'react';

// Inner is keyed by locale — forces unmount+remount of all animated sections
// when locale changes (soft navigation), resetting framer-motion whileInView state.
function Inner({children}: {children: ReactNode}) {
  return <>{children}</>;
}

export default function LocaleMotionReset({children}: {children: ReactNode}) {
  const locale = useLocale();
  return <Inner key={locale}>{children}</Inner>;
}
