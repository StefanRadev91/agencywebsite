import { z } from 'zod';

import { budgets, limits, projectTypes, timelines } from './contact-options';

export { budgets, projectTypes, timelines };

/**
 * Shared by the form (client) and the API route (server).
 * Error messages are translation keys under Contact.errors.
 */
export const contactSchema = z.object({
  name: z.string('name').trim().min(limits.nameMin, 'name').max(limits.nameMax, 'name'),
  email: z.string('email').trim().max(limits.emailMax, 'email').pipe(z.email('email')),
  company: z.string('company').trim().max(limits.companyMax, 'company').default(''),
  projectType: z.enum(projectTypes, 'projectType'),
  budget: z.enum(budgets, 'budget'),
  timeline: z.enum(timelines, 'timeline'),
  message: z
    .string('message')
    .trim()
    .min(limits.messageMin, 'message')
    .max(limits.messageMax, 'messageLong'),
  consent: z.literal(true, 'consent'),
  /** Honeypot — real users never see or fill this. */
  hp: z.string().default(''),
  locale: z.enum(['bg', 'en']).default('bg'),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

/** First error key per field, for display next to the inputs. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    result[key] ??= issue.message;
  }
  return result;
}
