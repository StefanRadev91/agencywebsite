/** Shared navigation structure. Labels live in messages/*.json under "Nav". */
export const navItems = [
  { key: 'services', href: '/services' },
  { key: 'work', href: '/work' },
  { key: 'process', href: '/process' },
  { key: 'pricing', href: '/pricing' },
  { key: 'about', href: '/about' },
] as const;

export const serviceSlugs = ['websites', 'webapps', 'ecommerce', 'qa', 'hosting'] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export const legalLinks = [
  { key: 'privacy', href: '/legal/privacy' },
  { key: 'terms', href: '/legal/terms' },
] as const;

/** "Built with" strip. Names only — these are products, not translated. */
export const techStack = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Playwright',
  'Tailwind CSS',
  'Vercel',
] as const;

/**
 * Optional real numbers for the trust strip. Empty on purpose — never invent figures.
 * Example: { value: '50', label: { bg: 'стаи в системата', en: 'rooms in the system' } }
 */
export const trustStats: { value: string; label: { bg: string; en: string } }[] = [];
