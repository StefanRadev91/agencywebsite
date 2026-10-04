import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { Section } from '@/components/ui/section';
import { Timeline } from '@/components/ui/timeline';

type Props = { params: Promise<{ locale: string }> };

const stepKeys = [
  'discovery',
  'requirements',
  'design',
  'development',
  'qa',
  'launch',
  'support',
] as const;
/** Steps that include part of the free start. */
const freeSteps = new Set<string>(['discovery', 'design']);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Process.page' });
  return {
    title: t('title'),
    description: t('intro'),
    alternates: {
      canonical: `/${locale}/process`,
      languages: { bg: '/bg/process', en: '/en/process' },
    },
  };
}

export default async function ProcessPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Process.page');
  const tSteps = await getTranslations('Process.steps');

  const steps = stepKeys.map((key) => ({
    title: tSteps(`${key}.title`),
    description: tSteps(`${key}.details`),
    badge: freeSteps.has(key) ? t('free') : undefined,
    extra: (
      <div className="mt-5">
        <p className="text-muted mb-2 font-mono text-xs tracking-wide uppercase">{t('youGet')}</p>
        <ul className="space-y-1.5">
          {(tSteps.raw(`${key}.gets`) as string[]).map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden className="text-accent-ink font-mono">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  }));

  return (
    <>
      <Section h1 eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')}>
        <Timeline steps={steps} headingLevel={2} />
      </Section>
      <section className="container-page pb-(--section-y)" aria-labelledby="process-cta">
        <h2 id="process-cta" className="font-display text-h2 mb-6 font-extrabold">
          {t('ctaTitle')}
        </h2>
        <Button href="/contact" size="lg">
          {t('cta')}
          <ArrowRight />
        </Button>
      </section>
    </>
  );
}
