import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Section } from '@/components/ui/section';
import { WorkGrid } from '@/components/work/work-grid';
import { toWorkItem } from '@/lib/content/card';
import { getProjects } from '@/lib/content/projects';
import { pickMessages } from '@/lib/utils/pick-messages';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Work.page' });
  return {
    title: t('title'),
    description: t('intro'),
    alternates: { canonical: `/${locale}/work`, languages: { bg: '/bg/work', en: '/en/work' } },
  };
}

export default async function WorkPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Work');
  const items = getProjects().map((p) => toWorkItem(p, locale, t));

  return (
    <Section h1 eyebrow={t('page.eyebrow')} title={t('page.title')} intro={t('page.intro')}>
      <NextIntlClientProvider messages={pickMessages(await getMessages(), ['Work'])}>
        <WorkGrid items={items} />
      </NextIntlClientProvider>
      <p className="text-muted mt-12 max-w-2xl text-sm">{t('page.legend')}</p>
    </Section>
  );
}
