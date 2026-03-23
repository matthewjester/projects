export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://poetnotdead.com/#organization',
    name: 'Poet Not Dead',
    url: 'https://poetnotdead.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://poetnotdead.com/images/logo.png',
      width: 512,
      height: 512,
    },
    description: 'Poetry and music open mic uniting all art forms: poetry, prose, music, dance, and visual art in Bali and worldwide.',
    foundingDate: '2025',
    founder: {
      '@type': 'Person',
      name: 'Mat',
      sameAs: 'https://t.me/poetsnotdead/',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bali',
      addressRegion: 'Bali',
      addressCountry: 'ID',
    },
    sameAs: [
      'https://t.me/poetnotdead/',
      'https://www.instagram.com/poetnotdead',
      'https://youtube.com/@poetnotdead',
      'https://facebook.com/poetnotdead',
      'https://www.tiktok.com/@poetsnotdead',
      'https://www.threads.com/@poetnotdead',
      'https://x.com/poetnotdead',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'poetnotdead@gmail.com',
      contactType: 'customer service',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}

export function FAQJsonLd({items}: {items: {q: string; a: string}[]}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}

export function EventJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Poet Not Dead Open Mic',
    description: 'Open mic event for poets, musicians, dancers and creators. Free entry, free participation.',
    startDate: '2026-02-22T18:00:00+08:00',
    endDate: '2026-02-22T22:00:00+08:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Bali, Indonesia',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bali',
        addressRegion: 'Bali',
        addressCountry: 'ID',
      },
    },
    image: 'https://poetnotdead.com/images/events/event-22feb.jpg',
    organizer: {
      '@type': 'Organization',
      '@id': 'https://poetnotdead.com/#organization',
      name: 'Poet Not Dead',
      url: 'https://poetnotdead.com',
    },
    performer: {
      '@type': 'PerformingGroup',
      name: 'Poet Not Dead Community',
      url: 'https://poetnotdead.com',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://t.me/poetnotdead/',
      validFrom: '2026-02-01',
    },
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}
