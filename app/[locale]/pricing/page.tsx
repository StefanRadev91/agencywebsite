import type { Metadata } from 'next';
import { getFormatter, getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { FreeStart } from '@/components/sections/free-start';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { Tag } from '@/components/ui/tag';
import { pick } from '@/lib/content/projects';
import { getPricing, realPrice } from '@/lib/content/site-content';
import type { Plan } from '@/lib/schemas/pricing';
import { cn } from '@/lib/utils/cn';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pricing' });
  return {
    title: t('title'),
    description: t('intro'),
    alternates: {
      canonical: `/${locale}/pricing`,
      languages: { bg: '/bg/pricing', en: '/en/pricing' },
    },
  };
}

async function PlanGrid({ plans, monthly = false }: { plans: Plan[]; monthly?: boolean }) {
  const t = await getTranslations('Pricing');
  const format = await getFormatter();
  const locale = await getLocale();

  return (
    <ul className="grid gap-6 lg:grid-cols-3">
      {plans.map((plan, i) => {
        const value = realPrice(plan.from);
        const money =
          value === null
            ? null
            : format.number(value, {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0,
              });
        const price =
          money === null
            ? t('onRequest')
            : monthly
              ? t('perMonth', { price: money })
              : t('from', { price: money });

        return (
          <li key={plan.id}>
            <Reveal delay={0.08 * i} className="h-full">
              <div
                className={cn(
                  'bg-surface shadow-card flex h-full flex-col rounded-lg border p-6 md:p-8',
                  plan.highlighted ? 'border-accent-ink' : 'border-border',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-h3 font-extrabold">{pick(plan.name, locale)}</h3>
                  {plan.highlighted && <Tag variant="accent">{t('highlighted')}</Tag>}
                </div>
                <p className="text-muted mt-2">{pick(plan.tagline, locale)}</p>
                <p className="text-accent-ink mt-6 font-mono text-lg">{price}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.en} className="flex gap-3 text-sm">
                      <span aria-hidden className="text-accent-ink font-mono">
                        ✓
                      </span>
                      {pick(feature, locale)}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button
                    href="/contact"
                    variant={plan.highlighted ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {t('choose')}
                  </Button>
                </div>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Pricing');
  const pricing = getPricing();

  return (
    <>
      <Section h1 eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} className="pb-0" />

      <FreeStart showConditions />

      <Section title={t('websites.title')} intro={t('websites.intro')} className="pt-0">
        <PlanGrid plans={pricing.websites} />
      </Section>

      <Section title={t('maintenance.title')} intro={t('maintenance.intro')} className="pt-0">
        <PlanGrid plans={pricing.maintenance} monthly />
      </Section>

      <section className="container-page pb-(--section-y)" aria-labelledby="custom-title">
        <div className="border-border rounded-xl border p-8 md:p-14">
          <h2 id="custom-title" className="font-display text-h2 font-extrabold">
            {t('custom.title')}
          </h2>
          <p className="text-muted mt-4 max-w-xl text-lg">{t('custom.text')}</p>
          <div className="mt-8">
            <Button href="/contact" size="lg">
              {t('custom.cta')}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
