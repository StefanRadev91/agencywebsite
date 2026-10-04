'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Pulls its child slightly toward the pointer. Transform-only, no animation library
 * (a CSS transition provides the easing). Off for touch and reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const offset = useRef({ x: 0, y: 0 });

  function onMove(event: React.PointerEvent) {
    const el = ref.current;
    if (!el || event.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    // rect includes the current translation, so remove it to find the resting center.
    const cx = rect.left + rect.width / 2 - offset.current.x;
    const cy = rect.top + rect.height / 2 - offset.current.y;
    offset.current = { x: (event.clientX - cx) * strength, y: (event.clientY - cy) * strength };
    el.style.transform = `translate3d(${offset.current.x}px, ${offset.current.y}px, 0)`;
  }

  function reset() {
    offset.current = { x: 0, y: 0 };
    if (ref.current) ref.current.style.transform = '';
  }

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn('ease-out-expo inline-block transition-transform duration-300', className)}
    >
      {children}
    </span>
  );
}
