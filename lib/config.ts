/** Single source of truth for studio identity. Replace the placeholders. */
export const siteConfig = {
  name: 'Studio', // TODO: [ИМЕ НА ФИРМАТА]
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  email: 'hello@example.com', // TODO
  phone: '+359 000 000 000', // TODO
  location: { city: 'Sofia', country: 'Bulgaria' },
  socials: {
    github: '',
    linkedin: '',
    facebook: '',
  },
} as const;
