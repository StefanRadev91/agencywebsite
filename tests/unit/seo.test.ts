import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { resolveAnalytics } from '@/lib/analytics';
import { getLegal } from '@/lib/content/site-content';

describe('analytics config', () => {
  it('is disabled by default', () => {
    expect(resolveAnalytics({})).toBeNull();
    expect(resolveAnalytics({ NEXT_PUBLIC_ANALYTICS_PROVIDER: 'plausible' })).toBeNull();
  });

  it('configures Plausible with the default script', () => {
    expect(
      resolveAnalytics({
        NEXT_PUBLIC_ANALYTICS_PROVIDER: 'plausible',
        NEXT_PUBLIC_ANALYTICS_DOMAIN: 'example.com',
      }),
    ).toEqual({
      src: 'https://plausible.io/js/script.js',
      attrs: { 'data-domain': 'example.com' },
    });
  });

  it('needs a script URL for Umami', () => {
    const base = { NEXT_PUBLIC_ANALYTICS_PROVIDER: 'umami', NEXT_PUBLIC_ANALYTICS_DOMAIN: 'abc' };
    expect(resolveAnalytics(base)).toBeNull();
    expect(
      resolveAnalytics({ ...base, NEXT_PUBLIC_ANALYTICS_SRC: 'https://u.example/s.js' }),
    ).toEqual({
      src: 'https://u.example/s.js',
      attrs: { 'data-website-id': 'abc' },
    });
  });

  it('ignores unknown providers', () => {
    expect(
      resolveAnalytics({ NEXT_PUBLIC_ANALYTICS_PROVIDER: 'ga', NEXT_PUBLIC_ANALYTICS_DOMAIN: 'x' }),
    ).toBeNull();
  });
});

describe('sitemap', () => {
  const entries = sitemap();

  it('lists every page in both locales with hreflang alternates', () => {
    const home = entries.filter((e) => /\/(bg|en)$/.test(e.url));
    expect(home).toHaveLength(2);
    expect(home[0]!.alternates?.languages).toMatchObject({
      bg: expect.any(String),
      en: expect.any(String),
    });
  });

  it('includes services, projects and legal pages', () => {
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith('/bg/services/qa'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/en/work/dar-ot-zemyata'))).toBe(true);
    expect(urls.some((u) => u.endsWith('/bg/legal/privacy'))).toBe(true);
  });

  it('has no duplicate URLs', () => {
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe('robots', () => {
  it('points to the sitemap and blocks the API', () => {
    const r = robots();
    expect(r.sitemap).toMatch(/\/sitemap\.xml$/);
    expect(JSON.stringify(r.rules)).toContain('/api/');
  });
});

describe('legal content', () => {
  it.each(['privacy', 'terms'])('%s exists in both languages', (slug) => {
    const doc = getLegal(slug);
    expect(doc).toBeDefined();
    expect(doc!.sections.length).toBeGreaterThan(3);
  });
});
