'use client';

import { useEffect, useRef } from 'react';
import { Reveal } from './reveal';
import { Tag } from './tag';

export type TimelineStep = {
  title: string;
  description: string;
  /** Small highlighted label next to the title, e.g. "Free". */
  badge?: string;
  /** Extra content rendered under the description (server-rendered nodes are fine). */
  extra?: React.ReactNode;
};

/** Vertical process timeline; the accent line grows with scroll (scaleY only, no library). */
export function Timeline({
  steps,
  headingLevel = 3,
}: {
  steps: TimelineStep[];
  /** Use 2 when the timeline sits directly under the page <h1>. */
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as const;
  const list = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = list.current;
    const line = bar.current;
    if (!element || !line) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the list's top crosses 70% of the viewport, 1 when its bottom crosses 60%.
      const progress = (0.7 * vh - rect.top) / (0.1 * vh + rect.height);
      line.style.transform = `scaleY(${Math.min(1, Math.max(0, progress))})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <ol ref={list} className="relative space-y-10 ps-12 md:space-y-14 md:ps-20">
      <span aria-hidden className="bg-border absolute start-4 top-2 bottom-2 w-px md:start-7" />
      <span
        ref={bar}
        aria-hidden
        className="bg-accent absolute start-4 top-2 bottom-2 w-px origin-top scale-y-0 transition-transform duration-150 ease-out md:start-7"
      />
      {steps.map((step, i) => (
        <li key={step.title} className="relative">
          <span
            aria-hidden
            className="border-border bg-background text-accent-ink absolute -start-12 top-0 flex size-9 items-center justify-center rounded-full border font-mono text-sm md:-start-20 md:size-14 md:text-base"
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <Reveal y={16}>
            <Heading className="font-display text-h3 flex flex-wrap items-center gap-3 font-extrabold">
              {step.title}
              {step.badge && <Tag variant="accent">{step.badge}</Tag>}
            </Heading>
            <p className="text-muted mt-2 max-w-2xl">{step.description}</p>
            {step.extra}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
