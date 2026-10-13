'use client';

import { openConsentSettings } from '@/lib/consent';

/** Footer link that reopens the cookie banner, so a choice can always be changed. */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      {label}
    </button>
  );
}
