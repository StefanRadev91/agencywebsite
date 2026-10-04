import { getLocale, getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/ui/project-card';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { toWorkItem } from '@/lib/content/card';
import { getProjects } from '@/lib/content/projects';

export async function SelectedWork() {
  const t = await getTranslations('Home.work');
  const tWork = await getTranslations('Work');
  const locale = await getLocale();
  const items = getProjects()
    .filter((p) => p.featured)
    .slice(0, 4)
    .map((p) => toWorkItem(p, locale, tWork));

  return (
    <Section id="work" eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')}>
      <ul className="grid gap-8 md:grid-cols-2">
        {items.map(({ slug, card }, i) => (
          <li key={slug}>
            <Reveal delay={0.08 * (i % 2)}>
              <ProjectCard {...card} />
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
