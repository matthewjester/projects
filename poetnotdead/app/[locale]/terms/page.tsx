import {setRequestLocale} from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  return {
    title: locale === 'ru' ? 'Условия использования — Poet Not Dead' : 'Terms of Service — Poet Not Dead',
    description: locale === 'ru' ? 'Условия использования Poet Not Dead' : 'Poet Not Dead Terms of Service',
  };
}

export default async function TermsPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  if (locale === 'ru') {
    return (
      <>
        <Header />
        <section style={{paddingTop: '120px'}}>
          <div className="c">
            <h1 className="st">Условия использования</h1>
            <div className="at">
              <p><strong>Последнее обновление:</strong> 19 февраля 2025</p>
              <p>Добро пожаловать на poetnotdead.com. Используя наш сайт, вы соглашаетесь с настоящими Условиями использования.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>1. Описание сервиса</h2>
              <p>Poet Not Dead — это международное творческое движение, организующее мероприятия в формате open mic. Наш сайт предоставляет информацию о проекте, событиях и сообществе.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>2. Использование контента</h2>
              <p>Весь контент на сайте защищён авторским правом. Использование контента без нашего письменного разрешения запрещено.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>3. Пользовательский контент</h2>
              <p>Публикуя контент через наши платформы, вы предоставляете нам неисключительную лицензию на его использование в рамках проекта Poet Not Dead.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>4. Ответственность</h2>
              <p>Сайт предоставляется &laquo;как есть&raquo;. Мы не несём ответственности за убытки, связанные с использованием сайта.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>5. Ссылки на внешние ресурсы</h2>
              <p>Наш сайт может содержать ссылки на внешние ресурсы. Мы не несём ответственности за содержание или политику конфиденциальности внешних сайтов.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>6. Изменения условий</h2>
              <p>Мы оставляем за собой право изменять настоящие Условия использования в любое время. Продолжая использование сайта, вы принимаете обновлённые условия.</p>
              <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>7. Контакты</h2>
              <p>По вопросам, связанным с Условиями использования, свяжитесь с нами: poetnotdead@gmail.com</p>
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
          <h1 className="st">Terms of Service</h1>
          <div className="at">
            <p><strong>Last updated:</strong> February 19, 2025</p>
            <p>Welcome to poetnotdead.com. By using our website, you agree to these Terms of Service.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>1. Service Description</h2>
            <p>Poet Not Dead is an international creative movement organizing open mic events. Our website provides information about the project, events, and community.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>2. Content Usage</h2>
            <p>All content on the website is protected by copyright. Use of content without our written permission is prohibited.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>3. User Content</h2>
            <p>By publishing content through our platforms, you grant us a non-exclusive license to use it within the Poet Not Dead project.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>4. Liability</h2>
            <p>The website is provided &ldquo;as is.&rdquo; We are not liable for any damages resulting from the use of the website.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>5. External Links</h2>
            <p>Our website may contain links to external resources. We are not responsible for the content or privacy policies of external sites.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>6. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms of Service at any time. By continuing to use the website, you accept the updated terms.</p>
            <h2 style={{color: 'var(--ac)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '40px'}}>7. Contact</h2>
            <p>For questions regarding these Terms of Service, contact us at: poetnotdead@gmail.com</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
