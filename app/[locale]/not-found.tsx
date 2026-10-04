import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <section className="container-page flex min-h-[70svh] flex-col justify-center py-(--section-y)">
      <p className="text-accent-ink font-mono text-sm tracking-wide uppercase">{t('code')}</p>
      <h1 className="font-display text-display mt-4 font-extrabold">404</h1>
      <p className="font-display text-h2 mt-6 max-w-2xl font-extrabold text-balance">
        {t('title')}
      </p>
      <p className="text-muted mt-4 max-w-xl text-lg">{t('text')}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Button href="/" size="lg">
          {t('home')}
          <ArrowRight />
        </Button>
        <Button href="/contact" size="lg" variant="secondary">
          {t('contact')}
        </Button>
      </div>
    </section>
  );
}
