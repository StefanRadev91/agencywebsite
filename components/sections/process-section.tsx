import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { Timeline } from '@/components/ui/timeline';

const stepKeys = [
  'discovery',
  'requirements',
  'design',
  'development',
  'qa',
  'launch',
  'support',
] as const;

export async function ProcessSection() {
  const t = await getTranslations('Home.process');
  const tSteps = await getTranslations('Process.steps');

  const steps = stepKeys.map((key) => ({
    title: tSteps(`${key}.title`),
    description: tSteps(`${key}.short`),
  }));

  return (
    <Section id="process" eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')}>
      <Timeline steps={steps} />
      <div className="mt-12 md:ps-20">
        <Button href="/process" variant="secondary">
          {t('details')}
        </Button>
      </div>
    </Section>
  );
}
