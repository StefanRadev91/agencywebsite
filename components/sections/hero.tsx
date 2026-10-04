import { getTranslations } from 'next-intl/server';
import { AnimatedHeadline } from '@/components/ui/animated-headline';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/reveal';
import { HeroBackdrop } from './hero-backdrop';

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
        <Reveal delay={0.5} className="mt-8 max-w-2xl">
          <p className="text-muted text-lg md:text-xl">{t('subtitle')}</p>
        </Reveal>
        <Reveal delay={0.65} className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/contact" size="lg">
            {t('primaryCta')}
            <ArrowRight />
          </Button>
          <Button href="/work" size="lg" variant="secondary">
            {t('secondaryCta')}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
