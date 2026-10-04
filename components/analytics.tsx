import Script from 'next/script';
import { resolveAnalytics } from '@/lib/analytics';

/** Cookieless analytics script; renders nothing unless env vars are set. */
export function Analytics() {
  const config = resolveAnalytics(process.env);
  if (!config) return null;
  return <Script src={config.src} strategy="afterInteractive" defer {...config.attrs} />;
}
