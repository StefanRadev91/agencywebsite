import { z } from 'zod';

export const projectTypes = ['website', 'webapp', 'ecommerce', 'qa', 'hosting', 'other'] as const;
export const budgets = [
  'lt-1000',
  '1000-3000',
  '3000-7000',
  '7000-15000',
  'gt-15000',
  'unsure',
] as const;
export const timelines = ['asap', '1-month', '1-3-months', '3-plus-months', 'flexible'] as const;

/**
 * Shared by the form (client) and the API route (server).
 * Error messages are translation keys under Contact.errors.
 */
export const contactSchema = z.object({
  name: z.string('name').trim().min(2, 'name').max(100, 'name'),
  email: z.string('email').trim().max(200, 'email').pipe(z.email('email')),
  company: z.string('company').trim().max(150, 'company').default(''),
  projectType: z.enum(projectTypes, 'projectType'),
  budget: z.enum(budgets, 'budget'),
  timeline: z.enum(timelines, 'timeline'),
  message: z.string('message').trim().min(10, 'message').max(5000, 'messageLong'),
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
