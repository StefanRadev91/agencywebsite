import { z } from 'zod';
import { localized, orTodo } from './common';

const plan = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: localized,
  tagline: localized,
  /** "From" price in EUR (maintenance plans: per month). [TODO] shows "price after consultation". */
  from: orTodo(z.number().positive()),
  features: z.array(localized).min(2),
  highlighted: z.boolean().default(false),
});

export const pricingSchema = z.object({
  currency: z.literal('EUR'),
  websites: z.array(plan).length(3),
  maintenance: z.array(plan).min(2),
});

export type Plan = z.infer<typeof plan>;
export type Pricing = z.infer<typeof pricingSchema>;
