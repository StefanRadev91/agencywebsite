'use client';

import { useEffect } from 'react';

// Lenis loads well after first paint so it stays out of the critical path; it only enhances scrolling.
const DEFER_MS = 1500;

/** Smooth scroll, skipped for prefers-reduced-motion. */
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let destroy: (() => void) | undefined;
    let cancelled = false;
    const timer = setTimeout(() => {
      import('lenis').then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({ autoRaf: true, anchors: true });
        destroy = () => lenis.destroy();
      });
    }, DEFER_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      destroy?.();
    };
  }, []);

  return children;
}
