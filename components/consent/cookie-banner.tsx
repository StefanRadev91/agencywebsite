'use client';

import { useEffect, useRef, useState } from 'react';
import { CONSENT_OPEN_EVENT, getConsent, saveConsent } from '@/lib/consent';

export type ConsentLabels = {
  title: string;
  text: string;
  policy: string;
  accept: string;
  reject: string;
  customize: string;
  save: string;
  ok: string;
  necessaryTitle: string;
  necessaryText: string;
  analyticsTitle: string;
  analyticsText: string;
  always: string;
};

type Props = {
  labels: ConsentLabels;
  /** Whether an analytics script is configured at all; otherwise there is nothing to opt in to. */
  analyticsAvailable: boolean;
  /** Privacy policy link, only once that page is published. */
  policyHref: string | null;
};

const buttonBase =
  'font-display inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors duration-(--dur-fast)';

export function CookieBanner({ labels, analyticsAvailable, policyHref }: Props) {
  // Rendered client-side only (see SiteWidgets), so reading the cookie here cannot cause a mismatch.
  const [open, setOpen] = useState(() => !getConsent());
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const reopen = () => {
      setAnalytics(getConsent()?.analytics ?? false);
      setCustom(false);
      setOpen(true);
      // Reopened on purpose (footer link): move focus so keyboard and screen-reader users land on it.
      setTimeout(() => ref.current?.focus(), 0);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.consentBanner = open ? 'open' : 'closed';
    return () => {
      delete document.documentElement.dataset.consentBanner;
    };
  }, [open]);

  if (!open) return null;

  const choose = (value: boolean) => {
    saveConsent({ analytics: value });
    setOpen(false);
  };

  return (
    <section
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      style={{ outline: 'none' }}
      className="animate-pop border-border bg-surface shadow-card fixed inset-x-3 bottom-3 z-50 rounded-lg border p-5 sm:right-auto sm:bottom-6 sm:left-6 sm:w-[26rem]"
    >
      <h2 id="cookie-title" className="font-display text-lg font-extrabold">
        {labels.title}
      </h2>
      <p className="text-muted mt-2 text-sm">
        {labels.text}
        {policyHref && (
          <>
            {' '}
            <a href={policyHref} className="text-foreground underline underline-offset-4">
              {labels.policy}
            </a>
          </>
        )}
      </p>

      {custom && analyticsAvailable && (
        <div className="border-border mt-4 space-y-3 border-t pt-4 text-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">{labels.necessaryTitle}</p>
              <p className="text-muted">{labels.necessaryText}</p>
            </div>
            <span className="text-muted shrink-0 text-xs">{labels.always}</span>
          </div>
          <label className="flex cursor-pointer items-start justify-between gap-4">
            <span>
              <span className="block font-semibold">{labels.analyticsTitle}</span>
              <span className="text-muted block">{labels.analyticsText}</span>
            </span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
              className="accent-accent mt-1 size-5 shrink-0"
            />
          </label>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {!analyticsAvailable ? (
          <button
            type="button"
            onClick={() => choose(false)}
            className={`${buttonBase} bg-accent text-accent-foreground hover:shadow-(--glow)`}
          >
            {labels.ok}
          </button>
        ) : custom ? (
          <button
            type="button"
            onClick={() => choose(analytics)}
            className={`${buttonBase} bg-accent text-accent-foreground hover:shadow-(--glow)`}
          >
            {labels.save}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => choose(true)}
              className={`${buttonBase} bg-accent text-accent-foreground hover:shadow-(--glow)`}
            >
              {labels.accept}
            </button>
            <button
              type="button"
              onClick={() => choose(false)}
              className={`${buttonBase} border-border hover:border-foreground border`}
            >
              {labels.reject}
            </button>
            <button
              type="button"
              onClick={() => setCustom(true)}
              className={`${buttonBase} text-muted hover:text-foreground`}
            >
              {labels.customize}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
