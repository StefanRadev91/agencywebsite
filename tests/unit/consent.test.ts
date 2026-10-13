import { describe, expect, it } from 'vitest';
import { parseConsent, serializeConsent } from '@/lib/consent';

describe('consent cookie', () => {
  it('round-trips both choices', () => {
    for (const analytics of [true, false]) {
      const cookie = serializeConsent({ analytics }).split(';')[0]!;
      expect(parseConsent(`other=1; ${cookie}; theme=dark`)).toEqual({ analytics });
    }
  });

  it('is first-party, long-lived and lax', () => {
    const cookie = serializeConsent({ analytics: true });
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toMatch(/Max-Age=\d{6,}/);
  });

  it('returns null when there is no (or an unknown) choice', () => {
    expect(parseConsent('')).toBeNull();
    expect(parseConsent('nw_consent=v9.a1')).toBeNull();
    expect(parseConsent('xnw_consent=v1.a1')).toBeNull();
  });
});
