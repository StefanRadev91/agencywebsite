import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Tag } from '@/components/ui/tag';
import { QaTerminal } from './qa-terminal';

const pillars = ['tests', 'budgets', 'checklist'] as const;

export async function QaFirst() {
  const t = await getTranslations('Home.qa');
  const lines = t.raw('terminal.lines') as string[];

  return (
    <section
      id="quality"
      aria-labelledby="quality-title"
      className="bg-surface border-border border-y py-(--section-y)"
    >
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Tag variant="mono" className="mb-6">
            {t('badge')}
          </Tag>
          <h2 id="quality-title" className="font-display text-h2 font-extrabold text-balance">
            {t('title')}
          </h2>
          <p className="text-muted mt-5 text-lg text-pretty">{t('intro')}</p>
          <ul className="mt-8 space-y-6">
            {pillars.map((key, i) => (
              <li key={key}>
                <Reveal delay={0.08 * i} y={16}>
                  <h3 className="font-display text-lg font-extrabold">
                    {t(`pillars.${key}.title`)}
                  </h3>
                  <p className="text-muted mt-1">{t(`pillars.${key}.text`)}</p>
                </Reveal>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button href="/services/qa" variant="secondary">
              {t('cta')}
            </Button>
          </div>
        </div>

        <div>
          <QaTerminal title={t('terminal.title')} lines={lines} />
          <p className="text-muted mt-3 text-xs">{t('terminal.caption')}</p>
        </div>
      </div>
    </section>
  );
}
