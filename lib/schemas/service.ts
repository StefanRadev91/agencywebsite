import { z } from 'zod';
import { serviceSlugs } from '@/lib/site-nav';
import { localized, orTodo } from './common';

export const serviceSchema = z.object({
  slug: z.enum(serviceSlugs),
  order: z.number().int(),
  title: localized,
  summary: localized,
  intro: localized,
  included: z.array(localized).min(3),
  /** Typical delivery time — an estimate, to be confirmed by the studio. */
  timeline: orTodo(localized),
  /** "Starting from" price in EUR; [TODO] renders as "price after consultation". */
  startingFrom: orTodo(z.number().positive()),
  faq: z.array(z.object({ question: localized, answer: localized })).min(2),
});

export type Service = z.infer<typeof serviceSchema>;
