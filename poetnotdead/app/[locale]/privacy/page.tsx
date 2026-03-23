import {setRequestLocale} from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  return {
    title: locale === 'ru' ? 'Политика конфиденциальности — Poet Not Dead' : 'Privacy Policy — Poet Not Dead',
    description: locale === 'ru' ? 'Политика конфиденциальности Poet Not Dead' : 'Poet Not Dead Privacy Policy',
  };
}

export default async function PrivacyPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  if (locale === 'ru') {
    return (
      <>
        <Header />
        <section style={{paddingTop: '120px'}}>
          <div className="c">
            <h1 className="st">Политика конфиденциальности</h1>
            <div className="at">
              <p><strong>Последнее обновление:</strong> 19 февраля 2025</p>
              <p>Poet Not Dead (&laquo;мы&raquo;, &laquo;нас&raquo;, &laquo;наш&raquo;) управляет веб-сайтом poetnotdead.com (&laquo;Сайт&raquo;). Настоящая Политика конфиденциальности описывает, как мы собираем, используем и защищаем вашу личную информацию.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>1. Какую информацию мы собираем</h2>
              <p>Мы можем собирать следующую информацию: имя и контактные данные, если вы связываетесь с нами через email или социальные сети; данные об использовании сайта (через стандартные серверные логи); cookies и аналогичные технологии для улучшения работы сайта.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>2. Как мы используем информацию</h2>
              <p>Мы используем собранную информацию для: ответа на ваши запросы; улучшения нашего сайта и услуг; отправки информации о мероприятиях (с вашего согласия); соблюдения правовых обязательств.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>3. Передача данных третьим лицам</h2>
              <p>Мы не продаём и не передаём вашу личную информацию третьим лицам, за исключением случаев, предусмотренных законом или необходимых для предоставления наших услуг.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>4. Cookies</h2>
              <p>Сайт может использовать cookies для улучшения пользовательского опыта. Вы можете отключить cookies в настройках вашего браузера.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>5. Безопасность данных</h2>
              <p>Мы принимаем разумные меры для защиты вашей личной информации от несанкционированного доступа, изменения или уничтожения.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>6. Ваши права</h2>
              <p>Вы имеете право: запросить доступ к своим персональным данным; запросить исправление или удаление ваших данных; отозвать согласие на обработку данных.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>7. Контакты</h2>
              <p>Если у вас есть вопросы относительно нашей Политики конфиденциальности, свяжитесь с нами: poetnotdead@gmail.com</p>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <section style={{paddingTop: '120px'}}>
        <div className="c">
          <h1 className="st">Privacy Policy</h1>
          <div className="at">
            <p><strong>Last updated:</strong> February 19, 2025</p>
            <p>Poet Not Dead (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website poetnotdead.com (&ldquo;Site&rdquo;). This Privacy Policy describes how we collect, use, and protect your personal information.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>1. Information We Collect</h2>
            <p>We may collect the following information: name and contact details if you reach out to us via email or social media; website usage data (through standard server logs); cookies and similar technologies to improve site functionality.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>2. How We Use Information</h2>
            <p>We use collected information to: respond to your inquiries; improve our website and services; send information about events (with your consent); comply with legal obligations.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>3. Third-Party Sharing</h2>
            <p>We do not sell or share your personal information with third parties, except as required by law or necessary to provide our services.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>4. Cookies</h2>
            <p>The Site may use cookies to improve user experience. You can disable cookies in your browser settings.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>5. Data Security</h2>
            <p>We take reasonable measures to protect your personal information from unauthorized access, alteration, or destruction.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>6. Your Rights</h2>
            <p>You have the right to: request access to your personal data; request correction or deletion of your data; withdraw consent for data processing.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>7. Contact</h2>
            <p>If you have questions about our Privacy Policy, contact us at: poetnotdead@gmail.com</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
