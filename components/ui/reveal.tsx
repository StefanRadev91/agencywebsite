'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Fades/slides content in once when it scrolls into view. Transform + opacity only.
 * Uses IntersectionObserver + CSS (no animation library) so it adds almost no JS and
 * works before Framer Motion has loaded. Content stays visible when scripting is off.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('reveal', shown && 'reveal-in', className)}
      style={{ '--delay': `${delay}s`, '--y': `${y}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
