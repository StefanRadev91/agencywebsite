import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/config';
import { getProjects } from '@/lib/content/projects';
import { getServices } from '@/lib/content/site-content';

const staticPaths = [
  '',
  '/services',
  '/work',
  '/process',
  '/pricing',
  '/about',
  '/contact',
  '/quality',
  '/legal/privacy',
  '/legal/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...getServices().map((s) => `/services/${s.slug}`),
    ...getProjects().map((p) => `/work/${p.slug}`),
  ];
  const url = (locale: string, path: string) => `${siteConfig.url}/${locale}${path}`;

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: url(locale, path),
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, url(l, path)])),
      },
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : path.split('/').length > 2 ? 0.6 : 0.8,
    })),
  );
}
