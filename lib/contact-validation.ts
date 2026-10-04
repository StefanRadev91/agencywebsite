import { budgets, limits, projectTypes, timelines } from '@/lib/schemas/contact-options';

type Values = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  consent: boolean;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const oneOf = (list: readonly string[], value: string) => list.includes(value);

/**
 * Lightweight client-side validation (no zod, which would add ~90 KB to the bundle).
 * Mirrors lib/schemas/contact.ts — the server remains the source of truth, and
 * tests/unit/contact-validation.test.ts keeps the two in sync.
 * Returns translation keys under Contact.errors, keyed by field.
 */
export function validateContact(values: Values): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (name.length < limits.nameMin || name.length > limits.nameMax) errors.name = 'name';
  if (!EMAIL.test(email) || email.length > limits.emailMax) errors.email = 'email';
  if (values.company.trim().length > limits.companyMax) errors.company = 'company';
  if (!oneOf(projectTypes, values.projectType)) errors.projectType = 'projectType';
  if (!oneOf(budgets, values.budget)) errors.budget = 'budget';
  if (!oneOf(timelines, values.timeline)) errors.timeline = 'timeline';
  if (message.length < limits.messageMin) errors.message = 'message';
  else if (message.length > limits.messageMax) errors.message = 'messageLong';
  if (values.consent !== true) errors.consent = 'consent';
  return errors;
}
