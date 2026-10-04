'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Reveal } from './reveal';

export type TimelineStep = { title: string; description: string };

/** Vertical process timeline; the accent line grows with scroll (scaleY only). */
export function Timeline({ steps }: { steps: TimelineStep[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <ol ref={ref} className="relative space-y-10 ps-12 md:space-y-14 md:ps-20">
      <span aria-hidden className="bg-border absolute start-4 top-2 bottom-2 w-px md:start-7" />
      <motion.span
        aria-hidden
        style={{ scaleY }}
        className="bg-accent absolute start-4 top-2 bottom-2 w-px origin-top md:start-7"
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
            <h3 className="font-display text-h3 font-extrabold">{step.title}</h3>
            <p className="text-muted mt-2 max-w-2xl">{step.description}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
