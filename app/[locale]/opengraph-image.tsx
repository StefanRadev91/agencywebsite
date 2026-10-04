import { getTranslations } from 'next-intl/server';
import { ogContentType, ogSize, renderOg } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'New Wave Web Intelligence';

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home.hero' });
  return renderOg({ title: t('title'), subtitle: t('subtitle').split('.')[0] });
}
