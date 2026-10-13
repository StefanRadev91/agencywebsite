import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { isLegalPublished, siteConfig } from '@/lib/config';
import { pick } from '@/lib/content/projects';
import { getLegal } from '@/lib/content/site-content';

type Props = { params: Promise<{ locale: string; slug: string }> };

const slugs = ['privacy', 'terms', 'cookies'] as const;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    slugs.filter(isLegalPublished).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = isLegalPublished(slug) ? getLegal(slug) : undefined;
  if (!doc) return {};
  return {
    title: pick(doc.title, locale),
    alternates: {
      canonical: `/${locale}/legal/${slug}`,
      languages: { bg: `/bg/legal/${slug}`, en: `/en/legal/${slug}` },
    },
  };
}

const hasDetail = (value: string) => value !== '[TODO]';

/** Fills {controller}, {contact}, … from siteConfig so details are edited in one place. */
function fill(text: string) {
  const { company, eik, address } = siteConfig.legal;
  const registered = [company, eik, address].every(hasDetail);
  const contact = [siteConfig.email, siteConfig.phone].filter(Boolean).join(', ');
  const values: Record<string, string> = {
    // Until the company details are filled in, the studio name stands in as the controller.
    controller: registered ? `${company}, ЕИК ${eik}, ${address}` : siteConfig.name,
    company,
    eik,
    address,
    email: siteConfig.email,
    phone: siteConfig.phone,
    contact,
  };
  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

function formatDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'bg' ? 'bg-BG' : 'en-GB', { dateStyle: 'long' }).format(
    date,
  );
}

export default async function LegalPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const doc = isLegalPublished(slug) ? getLegal(slug) : undefined;
  if (!doc) notFound();
  const t = await getTranslations('Legal');

  return (
    <article className="container-page max-w-3xl py-(--section-y)">
      <h1 className="font-display text-h1 font-extrabold text-balance">
        {pick(doc.title, locale)}
      </h1>
      <p className="text-muted mt-4 font-mono text-sm">
        {t('updated', { date: formatDate(siteConfig.legal.lastUpdated, locale) })}
      </p>
      {JSON.stringify(doc).includes('[TODO]') && (
        <p className="border-border bg-surface mt-8 rounded-md border p-4 text-sm">
          {t('draftNote')}
        </p>
      )}

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
