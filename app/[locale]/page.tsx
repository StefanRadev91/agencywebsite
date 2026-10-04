import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('Home');

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <p>{t('placeholder')}</p>
    </main>
  );
}
