import { getLocale, getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import type { Testimonial } from '@/lib/testimonials';

/** Renders nothing until real testimonials are provided (see lib/testimonials.ts). */
export async function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  const t = await getTranslations('Home.testimonials');
  const locale = (await getLocale()) as 'bg' | 'en';

  return (
    <Section id="testimonials" eyebrow={t('eyebrow')} title={t('title')}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.author}>
            <Card className="h-full">
              <figure>
                <blockquote className="text-lg">“{item.quote[locale]}”</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold">{item.author}</span>
                  <span className="text-muted"> — {item.role[locale]}</span>
                </figcaption>
              </figure>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
