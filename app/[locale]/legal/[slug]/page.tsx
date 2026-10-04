import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/config';
import { pick } from '@/lib/content/projects';
import { getLegal } from '@/lib/content/site-content';

type Props = { params: Promise<{ locale: string; slug: string }> };

const slugs = ['privacy', 'terms'] as const;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = getLegal(slug);
  if (!doc) return {};
  return {
    title: pick(doc.title, locale),
    alternates: {
      canonical: `/${locale}/legal/${slug}`,
      languages: { bg: `/bg/legal/${slug}`, en: `/en/legal/${slug}` },
    },
  };
}

/** Fills {company}, {eik}, … from siteConfig so details are edited in one place. */
function fill(text: string) {
  const values: Record<string, string> = {
    company: siteConfig.legal.company,
    eik: siteConfig.legal.eik,
    address: siteConfig.legal.address,
    email: siteConfig.email,
    phone: siteConfig.phone,
  };
  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

export default async function LegalPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const doc = getLegal(slug);
  if (!doc) notFound();
  const t = await getTranslations('Legal');

  return (
    <article className="container-page max-w-3xl py-(--section-y)">
      <h1 className="font-display text-h1 font-extrabold text-balance">
        {pick(doc.title, locale)}
      </h1>
      <p className="text-muted mt-4 font-mono text-sm">
        {t('updated', { date: siteConfig.legal.lastUpdated })}
      </p>
      <p className="border-border bg-surface mt-8 rounded-md border p-4 text-sm">
        {t('draftNote')}
      </p>

      <div className="mt-12 space-y-10">
        {doc.sections.map((section) => (
          <section key={section.heading.en}>
            <h2 className="font-display text-h3 font-extrabold">{pick(section.heading, locale)}</h2>
            <div className="text-muted mt-3 space-y-3">
              {section.body.map((paragraph) => (
                <p key={paragraph.en}>{fill(pick(paragraph, locale))}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
