import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, serviceIcons } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/reveal';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { pick } from '@/lib/content/projects';
import { getService, getServices, realPrice } from '@/lib/content/site-content';
import { isTodo } from '@/lib/content/todo';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getServices().map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: pick(service.title, locale),
    description: pick(service.summary, locale),
    alternates: {
      canonical: `/${locale}/services/${slug}`,
      languages: { bg: `/bg/services/${slug}`, en: `/en/services/${slug}` },
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = getService(slug);
  if (!service) notFound();

  const t = await getTranslations('Services.case');
  const format = await getFormatter();
  const price = realPrice(service.startingFrom);

  return (
    <article>
      <header className="container-page pt-12 pb-10 md:pt-20">
        <Link
          href="/services"
          className="text-muted hover:text-foreground inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft />
          {t('back')}
        </Link>
        <span
          aria-hidden
          className="bg-surface-2 text-accent-ink mt-8 flex size-14 items-center justify-center rounded-md"
        >
          {serviceIcons[service.slug]}
        </span>
        <h1 className="font-display text-h1 mt-6 max-w-4xl font-extrabold text-balance">
          {pick(service.title, locale)}
        </h1>
        <p className="text-muted mt-6 max-w-2xl text-xl text-pretty">
          {pick(service.intro, locale)}
        </p>
        <div className="mt-8">
          <Button href="/contact" size="lg">
            {t('cta')}
            <ArrowRight />
          </Button>
        </div>
      </header>

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[2fr_1fr] lg:gap-20">
        <section aria-labelledby="included-title">
          <h2 id="included-title" className="font-display text-h2 mb-8 font-extrabold">
            {t('included')}
          </h2>
          <ul className="space-y-4">
            {service.included.map((item) => (
              <li key={item.en} className="border-border flex gap-4 border-b pb-4 text-lg">
                <span aria-hidden className="text-accent-ink font-mono">
                  ✓
                </span>
                {pick(item, locale)}
              </li>
            ))}
          </ul>
        </section>

        <aside className="border-border bg-surface h-fit space-y-6 rounded-lg border p-6">
          <dl className="space-y-6">
            <div>
              <dt className="text-muted font-mono text-xs tracking-wide uppercase">
                {t('timeline')}
              </dt>
              <dd className="mt-1">
                {isTodo(service.timeline) ? t('onRequest') : pick(service.timeline, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-muted font-mono text-xs tracking-wide uppercase">
                {t('startingFrom')}
              </dt>
              <dd className="text-accent-ink mt-1 font-mono">
                {price === null
                  ? t('onRequest')
                  : format.number(price, {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 0,
                    })}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <section className="container-page pb-16" aria-labelledby="process-title">
        <h2 id="process-title" className="font-display text-h3 font-extrabold">
          {t('process')}
        </h2>
        <p className="text-muted mt-3 max-w-2xl text-lg">{t('processText')}</p>
        <div className="mt-6">
          <Button href="/process" variant="secondary">
            {t('processLink')}
          </Button>
        </div>
      </section>

      <section className="container-page pb-(--section-y)" aria-labelledby="faq-title">
        <h2 id="faq-title" className="font-display text-h2 mb-8 font-extrabold">
          {t('faq')}
        </h2>
        <Accordion
          items={service.faq.map((f) => ({
            question: pick(f.question, locale),
            answer: pick(f.answer, locale),
          }))}
        />
      </section>

      <section className="container-page pb-(--section-y)" aria-labelledby="cta-title">
        <Reveal>
          <div className="bg-accent text-accent-foreground rounded-xl p-8 md:p-14">
            <h2
              id="cta-title"
              className="font-display text-h2 max-w-2xl font-extrabold text-balance"
            >
              {t('ctaTitle')}
            </h2>
            <p className="mt-4 max-w-xl text-lg opacity-80">{t('ctaText')}</p>
            <div className="mt-8">
              <Button
                href="/contact"
                size="lg"
                className="bg-accent-foreground text-accent hover:shadow-none"
              >
                {t('cta')}
                <ArrowRight />
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
