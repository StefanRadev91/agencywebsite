/** Single source of truth for studio identity. Replace the placeholders. */
export const siteConfig = {
  name: 'New Wave Web Intelligence',
  shortName: 'New Wave',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  email: 'hello@example.com', // TODO: real contact email
  phone: '+359 000 000 000', // TODO: real phone
  location: { city: 'Sofia', country: 'Bulgaria' },
  founders: ['Martin Lichev', 'Stefan Radev'],
  /** Leave a URL empty to hide that social link. */
  socials: {
    github: '',
    linkedin: '',
    facebook: '',
  },
} as const;
