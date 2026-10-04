import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { serviceIcons } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { ServiceCard } from '@/components/ui/service-card';
import { FreeStart } from '@/components/sections/free-start';
import { pick } from '@/lib/content/projects';
import { getServices } from '@/lib/content/site-content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Services.page' });
  return {
    title: t('title'),
    description: t('intro'),
    alternates: {
      canonical: `/${locale}/services`,
      languages: { bg: '/bg/services', en: '/en/services' },
    },
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Services.page');

  return (
    <>
      <Section h1 eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')}>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getServices().map((service, i) => (
            <li key={service.slug}>
              <Reveal delay={0.06 * i} className="h-full">
                <ServiceCard
                  href={`/services/${service.slug}`}
                  title={pick(service.title, locale)}
                  description={pick(service.summary, locale)}
                  icon={serviceIcons[service.slug]}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>
      <FreeStart />
    </>
  );
}
