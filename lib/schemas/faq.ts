import { z } from 'zod';
import { localized } from './common';

const keywords = z.object({
  bg: z.array(z.string().min(2)).min(1),
  en: z.array(z.string().min(2)).min(1),
});

export const faqEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** Shown as a quick-reply chip in the chat. */
  suggested: z.boolean(),
  question: localized,
  /** Lowercase word stems (or short phrases) the matcher looks for in the visitor's message. */
  keywords,
  /** May contain {contact} (phone and email from lib/config.ts). */
  answer: localized,
  /** Show a "Free consultation" button under the answer. */
  cta: z.boolean(),
  /** Ids of follow-up questions offered after the answer. */
  related: z.array(z.string()),
});

export const faqSchema = z.object({ entries: z.array(faqEntrySchema).min(5) });

export type FaqEntry = z.infer<typeof faqEntrySchema>;
