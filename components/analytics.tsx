import { resolveAnalytics } from '@/lib/analytics';
import { AnalyticsLoader } from './analytics-loader';

/** Cookieless analytics script; renders nothing unless env vars are set, and waits for consent. */
export function Analytics() {
  const config = resolveAnalytics(process.env);
  if (!config) return null;
  return <AnalyticsLoader src={config.src} attrs={config.attrs} />;
}
