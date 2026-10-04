import { getLocale, getTranslations } from 'next-intl/server';
import { serviceIcons } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { ServiceCard } from '@/components/ui/service-card';
import { pick } from '@/lib/content/projects';
import { getServices } from '@/lib/content/site-content';

export async function ServicesOverview() {
  const t = await getTranslations('Home.services');
  const locale = await getLocale();

  return (
    <Section id="services" eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')}>
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
  );
}
