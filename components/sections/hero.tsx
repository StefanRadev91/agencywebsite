import { getTranslations } from 'next-intl/server';
import { AnimatedHeadline } from '@/components/ui/animated-headline';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { HeroBackdrop } from './hero-backdrop';

const delay = (seconds: number) => ({ '--delay': `${seconds}s` }) as React.CSSProperties;

export async function Hero() {
  const t = await getTranslations('Home.hero');

  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop />
      <div className="container-page flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center py-20">
        <p className="text-accent-ink mb-6 font-mono text-sm tracking-wide uppercase">
          {t('eyebrow')}
        </p>
        <AnimatedHeadline
          text={t('title')}
          accentWords={[Number(t('accentIndex'))]}
          className="text-display max-w-5xl"
        />
        {/* Above the fold: transform-only entrance so the text is painted immediately (LCP). */}
        <p
          className="animate-rise text-muted mt-8 max-w-2xl text-lg md:text-xl"
          style={delay(0.35)}
        >
          {t('subtitle')}
        </p>
        <div className="animate-rise mt-10 flex flex-wrap items-center gap-4" style={delay(0.45)}>
          <Button href="/contact" size="lg" prefetch={false}>
            {t('primaryCta')}
            <ArrowRight />
          </Button>
          <Button href="/work" size="lg" variant="secondary" prefetch={false}>
            {t('secondaryCta')}
          </Button>
        </div>
      </div>
    </section>
  );
}
