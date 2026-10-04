import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { LighthouseBadge } from '@/components/ui/lighthouse-badge';
import { ProjectMedia } from '@/components/ui/project-media';
import { Reveal } from '@/components/ui/reveal';
import { Tag } from '@/components/ui/tag';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/config';
import { absoluteUrl, JsonLd } from '@/lib/json-ld';
import { getNextProject, getProject, getProjects, pick } from '@/lib/content/projects';
import { isTodo, isVisible, SHOW_TODO } from '@/lib/content/todo';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getProjects().map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: pick(project.title, locale),
    description: pick(project.summary, locale),
    alternates: {
      canonical: `/${locale}/work/${slug}`,
      languages: { bg: `/bg/work/${slug}`, en: `/en/work/${slug}` },
    },
  };
}

/** Dev-only slot shown where content is still "[TODO]". */
function TodoSlot({ slug }: { slug: string }) {
  return (
    <p className="border-border text-muted rounded-md border border-dashed p-4 font-mono text-sm">
      [TODO] content/projects/{slug}.json
    </p>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations('Work');
  const tc = await getTranslations('Work.case');
  const isConcept = project.kind === 'concept';
  const next = getNextProject(slug);
  const title = pick(project.title, locale);

  const client = project.client;
  const clientName = client && !isTodo(client.name) ? client.name : null;
  const industry = client && !isTodo(client.industry) ? pick(client.industry, locale) : null;
  const quality = isTodo(project.quality) ? null : project.quality;
  const liveUrl = isTodo(project.liveUrl) ? null : project.liveUrl;

  const textSection = (heading: string, value: typeof project.challenge) =>
    isVisible(value) && (
      <Reveal>
        <h2 className="font-display text-h3 mb-4 font-extrabold">{heading}</h2>
        {isTodo(value) ? (
          <TodoSlot slug={slug} />
        ) : (
          <p className="text-muted text-lg text-pretty">{pick(value, locale)}</p>
        )}
      </Reveal>
    );

  const creativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: pick(project.summary, locale),
    inLanguage: locale,
    url: absoluteUrl(`/${locale}/work/${slug}`),
    creator: { '@type': 'Organization', name: siteConfig.name },
    ...(project.cover ? { image: absoluteUrl(project.cover.src) } : {}),
    ...(Array.isArray(project.stack) ? { keywords: project.stack.join(', ') } : {}),
    ...(liveUrl ? { sameAs: liveUrl } : {}),
  };

  return (
    <article>
      <JsonLd data={creativeWork} />
      <header className="container-page pt-12 pb-10 md:pt-20">
        <Link href="/work" className="text-muted hover:text-foreground text-sm">
          ← {tc('back')}
        </Link>
        <div className="mt-8 flex flex-wrap gap-2">
          {isConcept && <Tag variant="accent">{t('conceptLabel')}</Tag>}
          {project.status === 'in-progress' && <Tag>{t('status.inProgress')}</Tag>}
          {project.kind === 'internal' && <Tag>{t('status.ownProduct')}</Tag>}
          {project.categories.map((c) => (
            <Tag key={c} variant="outline">
              {t(`categories.${c}`)}
            </Tag>
          ))}
        </div>
        <h1 className="font-display text-h1 mt-6 max-w-4xl font-extrabold text-balance">{title}</h1>
        <p className="text-muted mt-6 max-w-2xl text-xl text-pretty">
          {pick(project.summary, locale)}
        </p>
        {liveUrl && (
          <div className="mt-8">
            <Button href={liveUrl} target="_blank" rel="noopener noreferrer">
              {tc('liveSite')}
              <span aria-hidden>↗</span>
            </Button>
          </div>
        )}
      </header>

      <div className="container-page">
        <div className="overflow-hidden rounded-xl">
          <ProjectMedia
            image={project.cover}
            hue={project.hue}
            label={title}
            sizes="(min-width: 1280px) 1200px, 100vw"
            priority
            className="aspect-[16/8]"
          />
        </div>
      </div>

      {isConcept && (
        <div className="container-page mt-10">
          <p className="border-accent-ink bg-surface rounded-lg border p-5 text-sm">
            <strong className="text-accent-ink">{t('conceptLabel')} · Studio Labs.</strong>{' '}
            {tc('conceptNote')}
          </p>
        </div>
      )}

      <div className="container-page grid gap-12 py-(--section-y) lg:grid-cols-[1fr_2fr] lg:gap-20">
        <dl className="space-y-6 text-sm">
          {clientName && (
            <div>
              <dt className="text-muted font-mono text-xs tracking-wide uppercase">
                {tc('client')}
              </dt>
              <dd className="mt-1 text-base">{clientName}</dd>
            </div>
          )}
          {industry && (
            <div>
              <dt className="text-muted font-mono text-xs tracking-wide uppercase">
                {tc('industry')}
              </dt>
              <dd className="mt-1 text-base">{industry}</dd>
            </div>
          )}
          {isVisible(project.role) && (
            <div>
              <dt className="text-muted font-mono text-xs tracking-wide uppercase">{tc('role')}</dt>
              <dd className="mt-1 text-base">
                {isTodo(project.role) ? <TodoSlot slug={slug} /> : pick(project.role, locale)}
              </dd>
            </div>
          )}
          {isVisible(project.stack) && (
            <div>
              <dt className="text-muted font-mono text-xs tracking-wide uppercase">
                {isConcept ? tc('stackProposed') : tc('stack')}
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {isTodo(project.stack) ? (
                  <TodoSlot slug={slug} />
                ) : (
                  project.stack.map((s) => (
                    <Tag key={s} variant="mono">
                      {s}
                    </Tag>
                  ))
                )}
              </dd>
            </div>
          )}
        </dl>

        <div className="space-y-12">
          {textSection(isConcept ? tc('brief') : tc('challenge'), project.challenge)}
          {textSection(isConcept ? tc('approach') : tc('solution'), project.solution)}
        </div>
      </div>

      {isVisible(project.screens) && (
        <section className="container-page pb-(--section-y)" aria-labelledby="screens-title">
          <h2 id="screens-title" className="font-display text-h2 mb-10 font-extrabold">
            {tc('screens')}
          </h2>
          {isTodo(project.screens) ? (
            <TodoSlot slug={slug} />
          ) : (
            <ul className="grid items-start gap-6 md:grid-cols-3">
              {project.screens.map((screen, i) => (
                <li key={screen.caption.en}>
                  <Reveal delay={0.08 * i}>
                    <figure>
                      <div className="border-border overflow-hidden rounded-lg border">
                        <ProjectMedia
                          image={screen.image}
                          hue={screen.hue}
                          label={pick(screen.caption, locale)}
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                      </div>
                      <figcaption className="text-muted mt-3 text-sm">
                        {pick(screen.caption, locale)}
                      </figcaption>
                    </figure>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {(isTodo(project.results) ? SHOW_TODO : project.results.length > 0) && (
        <section
          className="border-border bg-surface border-y py-(--section-y)"
          aria-labelledby="results-title"
        >
          <div className="container-page">
            <h2 id="results-title" className="font-display text-h2 mb-10 font-extrabold">
              {tc('results')}
            </h2>
            {isTodo(project.results) ? (
              <TodoSlot slug={slug} />
            ) : (
              <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {project.results.map((r) => (
                  <div key={r.label.en}>
                    <dd className="font-display text-h1 text-accent-ink font-extrabold">
                      {r.value}
                    </dd>
                    <dt className="text-muted mt-1">{pick(r.label, locale)}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}

      {!isConcept && (quality !== null || (isTodo(project.quality) && SHOW_TODO)) && (
        <section className="container-page py-(--section-y)" aria-labelledby="quality-title">
          <h2 id="quality-title" className="font-display text-h2 mb-10 font-extrabold">
            {tc('quality')}
          </h2>
          {quality === null ? (
            <TodoSlot slug={slug} />
          ) : (
            <div className="space-y-6">
              {quality.lighthouse && (
                <LighthouseBadge
                  scores={quality.lighthouse}
                  labels={{
                    performance: tc('lh.performance'),
                    accessibility: tc('lh.accessibility'),
                    bestPractices: tc('lh.bestPractices'),
                    seo: tc('lh.seo'),
                  }}
                />
              )}
              {quality.e2eTests !== null && (
                <p className="text-accent-ink font-mono">
                  {tc('tests', { count: quality.e2eTests })}
                </p>
              )}
            </div>
          )}
        </section>
      )}

      <section className="container-page pb-(--section-y)" aria-labelledby="next-title">
        <h2 id="next-title" className="text-muted mb-4 font-mono text-sm tracking-wide uppercase">
          {tc('next')}
        </h2>
        <Link
          href={`/work/${next.slug}`}
          className="group border-border hover:border-accent-ink flex items-center justify-between gap-6 rounded-xl border p-8 transition-colors duration-(--dur-base) md:p-12"
        >
          <span className="font-display text-h1 font-extrabold text-balance">
            {pick(next.title, locale)}
          </span>
          <ArrowRight className="text-accent-ink ease-out-expo size-8 shrink-0 transition-transform duration-(--dur-base) group-hover:translate-x-2" />
        </Link>
      </section>
    </article>
  );
}
