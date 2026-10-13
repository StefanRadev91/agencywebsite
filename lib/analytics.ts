export type AnalyticsScript = { src: string; attrs: Record<string, string> };

type Env = Record<string, string | undefined>;

/**
 * Cookieless analytics, off unless configured.
 * - plausible: NEXT_PUBLIC_ANALYTICS_DOMAIN = your site domain (src optional, for self-hosting)
 * - vercel: Vercel Web Analytics (cookieless, first-party). Enable it in the Vercel dashboard first.
 * - umami: NEXT_PUBLIC_ANALYTICS_DOMAIN = website id, NEXT_PUBLIC_ANALYTICS_SRC = script URL
 */
export function resolveAnalytics(env: Env): AnalyticsScript | null {
  // Read on the server only, so the non-public ANALYTICS_* names work too (some hosts refuse NEXT_PUBLIC_ ones).
  const read = (name: string) => (env[`NEXT_PUBLIC_${name}`] ?? env[name])?.trim();
  const provider = read('ANALYTICS_PROVIDER')?.toLowerCase();
  const domain = read('ANALYTICS_DOMAIN');
  const src = read('ANALYTICS_SRC');
  if (provider === 'vercel') return { src: '/_vercel/insights/script.js', attrs: {} };
  if (!provider || !domain) return null;

  if (provider === 'plausible') {
    return { src: src || 'https://plausible.io/js/script.js', attrs: { 'data-domain': domain } };
  }
  if (provider === 'umami' && src) {
    return { src, attrs: { 'data-website-id': domain } };
  }
  return null;
}
