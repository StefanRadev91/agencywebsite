import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';

const stepKeys = ['consult', 'preview', 'decide'] as const;
const conditionKeys = ['scope', 'preview', 'rights'] as const;

/** The "free start" funnel: consultation → free skeleton & design preview → quote. */
export async function FreeStart({
  showConditions = false,
  id,
  h1 = false,
}: {
  showConditions?: boolean;
  id?: string;
  h1?: boolean;
}) {
  const t = await getTranslations('FreeStart');

  return (
    <Section id={id} h1={h1} eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')}>
      <ol className="grid gap-6 md:grid-cols-3">
        {stepKeys.map((key, i) => (
          <li key={key}>
            <Reveal delay={0.08 * i} className="h-full">
              <div className="border-border bg-surface shadow-card h-full rounded-lg border p-6 md:p-8">
                <span className="text-accent-ink font-mono text-sm">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-h3 mt-4 font-extrabold">
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="text-muted mt-3">{t(`steps.${key}.text`)}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      {showConditions && (
        <div className="mt-16">
          <h3 className="font-display text-h3 mb-8 font-extrabold">{t('conditions.title')}</h3>
          <ul className="grid gap-8 md:grid-cols-3">
            {conditionKeys.map((key) => (
              <li key={key} className="border-border border-t pt-5">
                <h4 className="font-display text-lg font-extrabold">
                  {t(`conditions.${key}.title`)}
                </h4>
                <p className="text-muted mt-2">{t(`conditions.${key}.text`)}</p>
              </li>
            ))}
          </ul>
          <p className="text-accent-ink mt-8 font-mono text-sm">{t('conditions.note')}</p>
        </div>
      )}

      <div className="mt-12">
        <Button href="/contact" size="lg">
          {t('cta')}
          <ArrowRight />
        </Button>
      </div>
    </Section>
  );
}
