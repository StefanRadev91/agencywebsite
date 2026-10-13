/**
 * Cookie consent, kept dependency-free so it can ship in a small client chunk.
 * One first-party cookie records the choice: "v1.a1" (analytics accepted) or "v1.a0" (necessary only).
 */
export const CONSENT_COOKIE = 'nw_consent';
export const CONSENT_CHANGE_EVENT = 'nw-consent-change';
export const CONSENT_OPEN_EVENT = 'nw-consent-open';
const MAX_AGE = 60 * 60 * 24 * 180;

export type Consent = { analytics: boolean };

export function parseConsent(cookieHeader: string): Consent | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=v1\\.a([01])(?:;|$)`));
  return match ? { analytics: match[1] === '1' } : null;
}

export const serializeConsent = (consent: Consent) =>
  `${CONSENT_COOKIE}=v1.a${consent.analytics ? 1 : 0}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax`;

export function getConsent(): Consent | null {
  try {
    return parseConsent(document.cookie);
  } catch {
    return null;
  }
}

export function saveConsent(consent: Consent) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = serializeConsent(consent) + secure;
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: consent }));
}

/** Lets any link ("Cookie settings" in the footer) reopen the banner. */
export const openConsentSettings = () => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
