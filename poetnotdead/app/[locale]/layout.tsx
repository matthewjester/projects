import {NextIntlClientProvider, useMessages} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {Montserrat, Inter} from 'next/font/google';
import '../globals.css';
import type {Metadata} from 'next';
import type {ReactNode} from 'react';

const montserrat = Montserrat({
  variable: '--font-heading',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700', '900'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const messages = await getMessages({locale});
  const meta = (messages as any).meta;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    metadataBase: new URL('https://poetnotdead.com'),
    verification: {
      // TODO: Fill in after verifying at https://search.google.com/search-console
      // google: 'PASTE_GOOGLE_VERIFICATION_CODE_HERE',
      // yandex: 'PASTE_YANDEX_VERIFICATION_CODE_HERE',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ru: '/ru',
        en: '/en',
        'x-default': 'https://poetnotdead.com/en',
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://poetnotdead.com/${locale}`,
      siteName: 'Poet Not Dead',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Poet Not Dead',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['/images/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className={`${montserrat.variable} ${inter.variable} font-body antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
