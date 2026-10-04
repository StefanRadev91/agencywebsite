'use client';

import { motion } from 'framer-motion';
import { duration, easeOutExpo } from '@/lib/motion';

/** Fades/slides content in once when it scrolls into view. Transform + opacity only. */
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
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: duration.slow, ease: easeOutExpo, delay }}
    >
      {children}
    </motion.div>
  );
}
