/** Single source of truth for studio identity. Replace the placeholders. */
export const siteConfig = {
  name: 'New Wave Web Intelligence',
  shortName: 'New Wave',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  email: 'hello@example.com', // TODO: real contact email
  phone: '+359 897 269 135',
  location: { city: 'Sofia', country: 'Bulgaria' },
  founders: ['Martin Lichev', 'Stefan Radev'],
  /** Leave a URL empty to hide that social link. */
  socials: {
    github: '',
    linkedin: '',
    facebook: '',
  },
  /** Legal entity details used in the Privacy Policy and Terms. Fill in once registered. */
  legal: {
    company: '[TODO]',
    eik: '[TODO]',
    address: '[TODO]',
    lastUpdated: '[TODO]',
  },
} as const;
