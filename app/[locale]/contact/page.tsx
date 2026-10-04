import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/contact/contact-form';
import { siteConfig } from '@/lib/config';

type Props = { params: Promise<{ locale: string }> };

const nextSteps = ['receive', 'call', 'preview'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact.page' });
  return {
    title: t('title'),
    description: t('intro'),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { bg: '/bg/contact', en: '/en/contact' },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');
  const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, '')}`;

  return (
    <div className="container-page grid gap-16 py-(--section-y) lg:grid-cols-[1fr_1.4fr] lg:gap-24">
      <div>
        <p className="text-accent-ink mb-4 font-mono text-sm tracking-wide uppercase">
          {t('page.eyebrow')}
        </p>
        <h1 className="font-display text-h1 font-extrabold text-balance">{t('page.title')}</h1>
        <p className="text-muted mt-5 text-lg text-pretty">{t('page.intro')}</p>

        <dl className="mt-10 space-y-5">
          <div>
            <dt className="text-muted font-mono text-xs tracking-wide uppercase">
              {t('details.email')}
            </dt>
            <dd className="mt-1 text-lg">
              <a href={`mailto:${siteConfig.email}`} className="hover:text-accent-ink">
                {siteConfig.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted font-mono text-xs tracking-wide uppercase">
              {t('details.phone')}
            </dt>
            <dd className="mt-1 text-lg">
              <a href={phoneHref} className="hover:text-accent-ink">
                {siteConfig.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted font-mono text-xs tracking-wide uppercase">
              {t('details.location')}
            </dt>
            <dd className="mt-1 text-lg">
              {siteConfig.location.city}, {siteConfig.location.country}
            </dd>
          </div>
        </dl>

        <div className="border-border mt-12 border-t pt-8">
          <h2 className="font-display text-lg font-extrabold">{t('next.title')}</h2>
          <ol className="mt-4 space-y-3">
            {nextSteps.map((key, i) => (
              <li key={key} className="text-muted flex gap-4">
                <span className="text-accent-ink font-mono">{String(i + 1).padStart(2, '0')}</span>
                {t(`next.${key}`)}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
