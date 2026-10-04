import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Accordion } from '@/components/ui/accordion';
import { AnimatedHeadline } from '@/components/ui/animated-headline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox, Input, Select, Textarea } from '@/components/ui/form-fields';
import { ProjectCard } from '@/components/ui/project-card';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { ServiceCard } from '@/components/ui/service-card';
import { Tag } from '@/components/ui/tag';
import { Timeline } from '@/components/ui/timeline';

export const metadata: Metadata = { title: 'Styleguide', robots: { index: false, follow: false } };

const swatches = [
  'background',
  'surface',
  'surface-2',
  'foreground',
  'muted',
  'border',
  'accent',
  'accent-ink',
  'danger',
  'success',
];

const faq = [
  { question: 'How long does a typical website take?', answer: 'Placeholder answer for the FAQ.' },
  {
    question: 'Do you include automated tests?',
    answer: 'Yes — Playwright tests ship with every project.',
  },
];

const steps = [
  { title: 'Discovery', description: 'We learn about your goals and constraints.' },
  { title: 'Design', description: 'UX and UI, reviewed with you.' },
  { title: 'Build & QA', description: 'Development with automated tests from day one.' },
];

export default async function StyleguidePage({ params }: { params: Promise<{ locale: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Common');

  return (
    <div>
      <div className="container-page flex items-center justify-between py-6">
        <span className="text-muted font-mono text-sm">/styleguide — dev only</span>
        <div className="flex items-center gap-3">
          <LanguageSwitcher
            labels={{
              label: t('language'),
              names: { bg: t('languageName.bg'), en: t('languageName.en') },
            }}
          />
          <ThemeToggle labels={{ toLight: t('switchToLight'), toDark: t('switchToDark') }} />
        </div>
      </div>

      <Section eyebrow="Typography" title="Large type, strong contrast">
        <AnimatedHeadline text="From idea to launch" accentWords={[3]} className="text-display" />
        <p className="text-muted mt-6 max-w-xl text-lg">
          Body text in Inter, display in Onest. Кирилицата работи: От идея до пускане и поддръжка.
        </p>
        <p className="text-accent-ink mt-4 font-mono text-sm">Lighthouse 100 · 42 tests passed</p>
      </Section>

      <Section eyebrow="Colors" title="Theme tokens">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {swatches.map((name) => (
            <div key={name}>
              <div
                className="border-border h-16 rounded-md border"
                style={{ background: `var(--${name})` }}
              />
              <p className="text-muted mt-2 font-mono text-xs">{name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Buttons & tags" title="Interactive basics">
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/contact">Start a project</Button>
          <Button variant="secondary" href="/work">
            See our work
          </Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Tag>Neutral</Tag>
          <Tag variant="accent">Concept</Tag>
          <Tag variant="outline">Outline</Tag>
          <Tag variant="mono">Lighthouse 100</Tag>
        </div>
      </Section>

      <Section eyebrow="Cards" title="Services & work">
        <div className="grid gap-6 md:grid-cols-3">
          <ServiceCard
            href="/services"
            title="Business websites"
            description="Fast, accessible, tested."
            icon="◧"
          />
          <ServiceCard
            href="/services"
            title="Web apps"
            description="Booking systems, dashboards, admin panels."
            icon="◨"
          />
          <Card interactive>
            <h3 className="font-display text-h3 font-extrabold">Generic card</h3>
            <p className="text-muted mt-3">Hover to lift.</p>
          </Card>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <ProjectCard
            href="/work"
            title="Dental clinic site"
            category="Website"
            summary="Placeholder summary."
            conceptLabel="Concept"
            hue={170}
          />
          <ProjectCard
            href="/work"
            title="Hotel booking system"
            category="Web app"
            summary="Placeholder summary."
            statusLabel="In progress"
            hue={90}
          />
          <ProjectCard
            href="/work"
            title="Price monitoring"
            category="Web app"
            summary="Placeholder summary."
            hue={280}
          />
        </div>
      </Section>

      <Section eyebrow="Process" title="Timeline">
        <Timeline steps={steps} />
      </Section>

      <Section eyebrow="FAQ" title="Accordion">
        <Accordion items={faq} />
      </Section>

      <Section eyebrow="Forms" title="Form fields">
        <form className="grid max-w-2xl gap-6" noValidate>
          <Input label="Name" name="name" placeholder="Your name" required />
          <Input label="Email" name="email" type="email" error="Enter a valid email" />
          <Input label="Company" name="company" optionalLabel="optional" />
          <Select
            label="Project type"
            name="type"
            placeholder="Select…"
            options={[
              { value: 'website', label: 'Website' },
              { value: 'app', label: 'Web app' },
            ]}
          />
          <Textarea label="Message" name="message" hint="Tell us about your project" />
          <Checkbox label="I agree to the processing of my data" name="consent" />
        </form>
      </Section>

      <Section eyebrow="Motion" title="Reveal on scroll">
        <Reveal>
          <Card>Fades and slides in once when scrolled into view.</Card>
        </Reveal>
      </Section>
    </div>
  );
}
