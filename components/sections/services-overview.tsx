import { getTranslations } from 'next-intl/server';
import { serviceIcons } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { ServiceCard } from '@/components/ui/service-card';
import { serviceSlugs } from '@/lib/site-nav';

export async function ServicesOverview() {
  const t = await getTranslations('Home.services');
  const tItems = await getTranslations('Services.items');

  return (
    <Section id="services" eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {serviceSlugs.map((slug, i) => (
          <li key={slug}>
            <Reveal delay={0.06 * i} className="h-full">
              <ServiceCard
                href={`/services/${slug}`}
                title={tItems(`${slug}.title`)}
                description={tItems(`${slug}.description`)}
                icon={serviceIcons[slug]}
              />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
