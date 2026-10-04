/** Zod-free constants shared by the form (client) and the API schema (server). */
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

export const limits = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 200,
  companyMax: 150,
  messageMin: 10,
  messageMax: 5000,
};
