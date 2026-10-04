import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getProject, pick } from '@/lib/content/projects';
import { ogContentType, ogSize, renderOg } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Case study';

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const t = await getTranslations({ locale, namespace: 'Work' });

  return renderOg({
    title: pick(project.title, locale),
    subtitle: pick(project.summary, locale),
    tag: project.kind === 'concept' ? t('conceptLabel') : t('page.eyebrow'),
  });
}
