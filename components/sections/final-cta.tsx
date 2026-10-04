import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/reveal';
import { siteConfig } from '@/lib/config';

export async function FinalCta() {
  const t = await getTranslations('Home.cta');

  return (
    <section aria-labelledby="cta-title" className="py-(--section-y)">
      <div className="container-page">
        <Reveal>
          <div className="bg-accent text-accent-foreground relative overflow-hidden rounded-xl p-8 md:p-16">
            <h2
              id="cta-title"
              className="font-display text-h1 max-w-3xl font-extrabold text-balance"
            >
              {t('title')}
            </h2>
            <p className="mt-5 max-w-xl text-lg opacity-80">{t('text')}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                href="/contact"
                size="lg"
                className="bg-accent-foreground text-accent hover:shadow-none"
              >
                {t('primary')}
                <ArrowRight />
              </Button>
              <Button
                href={`mailto:${siteConfig.email}`}
                size="lg"
                variant="ghost"
                className="text-accent-foreground hover:text-accent-foreground underline underline-offset-4"
              >
                {siteConfig.email}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
