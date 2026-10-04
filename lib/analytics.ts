export type AnalyticsScript = { src: string; attrs: Record<string, string> };

type Env = Record<string, string | undefined>;

/**
 * Cookieless analytics, off unless configured.
 * - plausible: NEXT_PUBLIC_ANALYTICS_DOMAIN = your site domain (src optional, for self-hosting)
 * - umami: NEXT_PUBLIC_ANALYTICS_DOMAIN = website id, NEXT_PUBLIC_ANALYTICS_SRC = script URL
 */
export function resolveAnalytics(env: Env): AnalyticsScript | null {
  const provider = env.NEXT_PUBLIC_ANALYTICS_PROVIDER?.trim().toLowerCase();
  const domain = env.NEXT_PUBLIC_ANALYTICS_DOMAIN?.trim();
  const src = env.NEXT_PUBLIC_ANALYTICS_SRC?.trim();
  if (!provider || !domain) return null;

  if (provider === 'plausible') {
    return { src: src || 'https://plausible.io/js/script.js', attrs: { 'data-domain': domain } };
  }
  if (provider === 'umami' && src) {
    return { src, attrs: { 'data-website-id': domain } };
  }
  return null;
}
