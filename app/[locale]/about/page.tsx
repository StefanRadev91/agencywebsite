import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';
import { Section } from '@/components/ui/section';
import { pick } from '@/lib/content/projects';
import { getTeam } from '@/lib/content/site-content';
import { isTodo } from '@/lib/content/todo';

type Props = { params: Promise<{ locale: string }> };

const valueKeys = ['quality', 'honest', 'direct', 'longterm'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  return {
    title: t('eyebrow'),
    description: t('intro'),
    alternates: {
      canonical: `/${locale}/about`,
      languages: { bg: '/bg/about', en: '/en/about' },
    },
  };
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('');

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');
  const lang = await getLocale();
  const { members, role, experience, bio } = getTeam();

  return (
    <>
      <Section h1 eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')}>
        <h2 className="font-display text-h3 mb-8 font-extrabold">{t('team.title')}</h2>
        <Reveal>
          <Card className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex shrink-0 gap-3">
              {members.map((member) => (
                <div
                  key={member.slug}
                  role="img"
                  aria-label={t('photoAlt', { name: member.name })}
                  className="bg-surface-2 text-accent-ink font-display flex size-24 items-center justify-center rounded-lg text-2xl font-extrabold sm:size-28 sm:text-3xl"
                >
                  {initials(member.name)}
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-display text-h3 font-extrabold">
                {members.map((m) => m.name).join(' & ')}
              </h3>
              <p className="text-accent-ink mt-1 font-mono text-sm">{pick(role, lang)}</p>
              <p className="mt-3 font-medium">{pick(experience, lang)}</p>
              {!isTodo(bio) && <p className="text-muted mt-3 max-w-2xl">{pick(bio, lang)}</p>}
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {members.flatMap((member) => [
                  member.links.github && (
                    <li key={member.slug + 'g'}>
                      <a href={member.links.github} className="underline underline-offset-4">
                        {member.name} · {t('links.github')}
                      </a>
                    </li>
                  ),
                  member.links.linkedin && (
                    <li key={member.slug + 'l'}>
                      <a href={member.links.linkedin} className="underline underline-offset-4">
                        {member.name} · {t('links.linkedin')}
                      </a>
                    </li>
                  ),
                ])}
              </ul>
            </div>
          </Card>
        </Reveal>
      </Section>

      <Section title={t('values.title')} className="pt-0">
        <ul className="grid gap-8 md:grid-cols-2">
          {valueKeys.map((key, i) => (
            <li key={key} className="border-border border-t pt-5">
              <Reveal delay={0.06 * i} y={16}>
                <h3 className="font-display text-h3 font-extrabold">
                  {t(`values.items.${key}.title`)}
                </h3>
                <p className="text-muted mt-2">{t(`values.items.${key}.text`)}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('how.title')} intro={t('how.text')} className="pt-0">
        <Button href="/process" variant="secondary">
          {t('how.cta')}
        </Button>
      </Section>
    </>
  );
}
