import { z } from 'zod';
import { localized } from './common';

export const legalSchema = z.object({
  slug: z.enum(['privacy', 'terms']),
  title: localized,
  sections: z.array(z.object({ heading: localized, body: z.array(localized).min(1) })).min(1),
});

export type LegalDoc = z.infer<typeof legalSchema>;
