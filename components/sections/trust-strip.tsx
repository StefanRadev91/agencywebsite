import { getLocale, getTranslations } from 'next-intl/server';
import { techStack, trustStats } from '@/lib/site-nav';

export async function TrustStrip() {
  const t = await getTranslations('Home.trust');
  const locale = (await getLocale()) as 'bg' | 'en';

  return (
    <section aria-label={t('title')} className="border-border border-y py-8">
      <div className="container-page mb-6 flex flex-wrap items-center justify-between gap-6">
        <p className="text-muted font-mono text-xs tracking-wide uppercase">{t('title')}</p>
        {trustStats.length > 0 && (
          <dl className="flex flex-wrap gap-x-10 gap-y-3">
            {trustStats.map((s) => (
              <div key={s.label.en} className="flex items-baseline gap-2">
                <dt className="sr-only">{s.label[locale]}</dt>
                <dd className="font-display text-h3 font-extrabold">{s.value}</dd>
                <span aria-hidden className="text-muted text-sm">
                  {s.label[locale]}
                </span>
              </div>
            ))}
          </dl>
        )}
      </div>
      <div className="overflow-hidden">
        <ul className="flex w-max animate-[marquee_40s_linear_infinite] gap-12 pe-12">
          {[...techStack, ...techStack].map((name, i) => (
            <li
              key={i}
              aria-hidden={i >= techStack.length}
              className="font-display text-h3 text-muted font-extrabold whitespace-nowrap"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
