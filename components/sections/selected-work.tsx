import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/ui/project-card';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';

/**
 * Temporary featured list — replaced by zod-validated content in Phase 4.
 * Slugs match the planned /content/projects entries.
 */
const featured = [
  { slug: 'dar-ot-zemyata', category: 'websiteEcommerce', hue: 95 },
  { slug: 'hotel-booking', category: 'webApp', hue: 35, status: 'inProgress' },
  { slug: 'price-monitoring', category: 'webApp', hue: 265, status: 'ownProduct' },
  { slug: 'concept-dental-clinic', category: 'website', hue: 175, concept: true },
] as const;

type Featured = (typeof featured)[number];
const statusOf = (p: Featured) => ('status' in p ? p.status : undefined);
const isConcept = (p: Featured) => 'concept' in p;

export async function SelectedWork() {
  const t = await getTranslations('Home.work');
  const tProjects = await getTranslations('Work.featured');
  const tCommon = await getTranslations('Work');

  return (
    <Section id="work" eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')}>
      <ul className="grid gap-8 md:grid-cols-2">
        {featured.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={0.08 * (i % 2)}>
              <ProjectCard
                href={`/work/${p.slug}`}
                title={tProjects(`${p.slug}.title`)}
                summary={tProjects(`${p.slug}.summary`)}
                category={tCommon(`categories.${p.category}`)}
                hue={p.hue}
                conceptLabel={isConcept(p) ? tCommon('conceptLabel') : undefined}
                statusLabel={statusOf(p) ? tCommon(`status.${statusOf(p)!}`) : undefined}
              />
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="mt-12 flex justify-center">
        <Button href="/work" variant="secondary" size="lg">
          {t('all')}
        </Button>
      </div>
    </Section>
  );
}
