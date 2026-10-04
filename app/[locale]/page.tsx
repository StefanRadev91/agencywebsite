import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FinalCta } from '@/components/sections/final-cta';
import { FreeStart } from '@/components/sections/free-start';
import { Hero } from '@/components/sections/hero';
import { ProcessSection } from '@/components/sections/process-section';
import { QaFirst } from '@/components/sections/qa-first';
import { SelectedWork } from '@/components/sections/selected-work';
import { ServicesOverview } from '@/components/sections/services-overview';
import { Testimonials } from '@/components/sections/testimonials';
import { TrustStrip } from '@/components/sections/trust-strip';
import { JsonLd, professionalService } from '@/lib/json-ld';
import { testimonials } from '@/lib/testimonials';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Meta');

  return (
    <>
      <JsonLd data={professionalService(locale, t('description'))} />
      <Hero />
      <TrustStrip />
      <ServicesOverview />
      <SelectedWork />
      <ProcessSection />
      <FreeStart />
      <QaFirst />
      <Testimonials items={testimonials} />
      <FinalCta />
    </>
  );
}
