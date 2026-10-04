'use client';

import { MotionConfig } from 'framer-motion';
import Lenis from 'lenis';
import { useEffect } from 'react';

/** Respects prefers-reduced-motion for Framer Motion and disables Lenis when reduced. */
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (query.matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
