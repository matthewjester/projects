import {setRequestLocale} from 'next-intl/server';
import {getMessages} from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Mission from '@/components/Mission';
import Manifest from '@/components/Manifest';
import Reviews from '@/components/Reviews';
import Events from '@/components/Events';
import Blog from '@/components/Blog';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import {OrganizationJsonLd, FAQJsonLd, EventJsonLd} from '@/components/JsonLd';
import LocaleMotionReset from '@/components/LocaleMotionReset';

type Props = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const messages = await getMessages({locale});
  const faq = (messages as any).faq;

  const faqItems = [
    {q: faq.q1, a: faq.a1},
    {q: faq.q2, a: faq.a2},
    {q: faq.q3, a: faq.a3},
    {q: faq.q4, a: faq.a4},
    {q: faq.q5, a: faq.a5},
    {q: faq.q6, a: faq.a6},
    {q: faq.q7, a: faq.a7},
  ];

  return (
    <>
      <OrganizationJsonLd />
      <FAQJsonLd items={faqItems} />
      <EventJsonLd />
      <Header />
      <LocaleMotionReset>
        <Hero />
        <About />
        <Mission />
        <Manifest />
        <Reviews />
        <Events />
        <Blog />
        <FAQ />
        <Contact />
      </LocaleMotionReset>
      <Footer />
    </>
  );
}
