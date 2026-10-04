import { siteConfig } from '@/lib/config';

/** Renders structured data. `<` is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

const isPlaceholderEmail = siteConfig.email.endsWith('@example.com');

export const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();

/** Organization / ProfessionalService data for the home page. */
export function professionalService(locale: string, description: string) {
  const sameAs = Object.values(siteConfig.socials).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    url: absoluteUrl(`/${locale}`),
    description,
    inLanguage: locale,
    telephone: siteConfig.phone,
    // Don't publish the placeholder address in structured data.
    ...(isPlaceholderEmail ? {} : { email: siteConfig.email }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressCountry: 'BG',
    },
    founder: siteConfig.founders.map((name) => ({ '@type': 'Person', name })),
    areaServed: ['BG', 'EU'],
    ...(sameAs.length ? { sameAs } : {}),
  };
}
