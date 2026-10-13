'use client';

import Script from 'next/script';
import { useSyncExternalStore } from 'react';
import { CONSENT_CHANGE_EVENT, parseConsent } from '@/lib/consent';

const subscribe = (onChange: () => void) => {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
};
const readCookies = () => {
  try {
    return document.cookie;
  } catch {
    return '';
  }
};

/** Loads the analytics script only after the visitor has accepted it. */
export function AnalyticsLoader({ src, attrs }: { src: string; attrs: Record<string, string> }) {
  const consent = parseConsent(useSyncExternalStore(subscribe, readCookies, () => ''));
  if (!consent?.analytics) return null;
  return <Script src={src} strategy="afterInteractive" defer {...attrs} />;
}
