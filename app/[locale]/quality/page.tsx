import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { Card } from '@/components/ui/card';
import { LighthouseBadge } from '@/components/ui/lighthouse-badge';
import { Section } from '@/components/ui/section';
import { qualityReportSchema } from '@/lib/schemas/quality';

type Props = { params: Promise<{ locale: string }> };

const checklistKeys = [
  'accessibility',
  'performance',
  'seo',
  'responsive',
  'forms',
  'security',
  'errors',
  'monitoring',
] as const;
const budgetKeys = ['lighthouse', 'lcp', 'cls'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Quality' });
  return {
    title: t('title'),
    description: t('intro'),
    alternates: {
      canonical: `/${locale}/quality`,
      languages: { bg: '/bg/quality', en: '/en/quality' },
    },
  };
}

function loadReport() {
  const file = path.join(process.cwd(), 'content', 'quality-report.json');
  return qualityReportSchema.parse(JSON.parse(fs.readFileSync(file, 'utf8')));
}

export default async function QualityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Quality');
  const format = await getFormatter();
  const report = loadReport();
  const measured = report.lighthouse !== null || report.e2eTests !== null;

  return (
    <>
      <Section h1 eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')}>
        <h2 className="font-display text-h3 mb-6 font-extrabold">{t('latest.title')}</h2>
        {measured ? (
          <div className="space-y-6">
            {report.lighthouse && (
              <LighthouseBadge
                scores={report.lighthouse}
                labels={{
                  performance: t('lh.performance'),
                  accessibility: t('lh.accessibility'),
                  bestPractices: t('lh.bestPractices'),
                  seo: t('lh.seo'),
                }}
              />
            )}
            <ul className="text-muted flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm">
              {report.e2eTests !== null && <li>{t('latest.e2e', { count: report.e2eTests })}</li>}
              {report.unitTests !== null && (
                <li>{t('latest.unit', { count: report.unitTests })}</li>
              )}
              {report.generatedAt && (
                <li>
                  {t('latest.date', {
                    date: format.dateTime(new Date(report.generatedAt), { dateStyle: 'medium' }),
                  })}
                </li>
              )}
            </ul>
          </div>
        ) : (
          <Card>
            <p className="text-muted">{t('latest.pending')}</p>
          </Card>
        )}
      </Section>

      <Section eyebrow={t('budgets.eyebrow')} title={t('budgets.title')} className="pt-0">
        <ul className="grid gap-6 md:grid-cols-3">
          {budgetKeys.map((key) => (
            <li key={key}>
              <Card className="h-full">
                <p className="text-accent-ink font-mono text-2xl">{t(`budgets.${key}.value`)}</p>
                <p className="text-muted mt-2">{t(`budgets.${key}.label`)}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow={t('checklist.eyebrow')} title={t('checklist.title')} className="pt-0">
        <ul className="grid gap-4 md:grid-cols-2">
          {checklistKeys.map((key) => (
            <li key={key} className="border-border flex gap-3 border-b pb-4">
              <span aria-hidden className="text-accent-ink font-mono">
                ✓
              </span>
              <span>{t(`checklist.items.${key}`)}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
