import { describe, expect, it } from 'vitest';
import { validateContact } from '@/lib/contact-validation';
import { contactSchema, fieldErrors } from '@/lib/schemas/contact';

const valid = {
  name: 'Ivan Petrov',
  email: 'ivan@example.com',
  company: '',
  projectType: 'website',
  budget: 'unsure',
  timeline: 'flexible',
  message: 'We need a new website for our small business.',
  consent: true,
};

const serverErrors = (input: typeof valid) => {
  const result = contactSchema.safeParse({ ...input, hp: '', locale: 'en' });
  return result.success ? {} : fieldErrors(result.error);
};

describe('client validation matches the server schema', () => {
  const cases: [string, Partial<typeof valid>][] = [
    ['valid input', {}],
    ['short name', { name: 'I' }],
    ['blank name', { name: '   ' }],
    ['bad email', { email: 'not-an-email' }],
    ['email without tld', { email: 'a@b' }],
    ['long company', { company: 'x'.repeat(151) }],
    ['no project type', { projectType: '' }],
    ['unknown budget', { budget: 'free' }],
    ['no timeline', { timeline: '' }],
    ['short message', { message: 'too short' }],
    ['huge message', { message: 'x'.repeat(5001) }],
    ['no consent', { consent: false }],
    [
      'everything wrong',
      {
        name: '',
        email: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: '',
        consent: false,
      },
    ],
  ];

  it.each(cases)('%s', (_label, override) => {
    const input = { ...valid, ...override };
    expect(validateContact(input)).toEqual(serverErrors(input));
  });
});
