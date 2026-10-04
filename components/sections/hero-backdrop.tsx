'use client';

import { motion } from 'framer-motion';

/** Decorative drifting gradient shapes. Transform-only animation; static under reduced motion. */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)',
        }}
      />
      <motion.div
        className="absolute -top-32 -right-24 size-[34rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgb(200 255 46 / 0.28), transparent 65%)',
        }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 -left-32 size-[30rem] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgb(120 90 255 / 0.22), transparent 65%)',
        }}
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
