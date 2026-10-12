/** Single source of truth for studio identity. Replace the placeholders. */
export const siteConfig = {
  name: 'New Wave Web Intelligence',
  shortName: 'New Wave',
  // Only read on the server. NEXT_SITE_URL works where a NEXT_PUBLIC_ name is not allowed.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_SITE_URL ?? 'http://localhost:3000',
  /** Leave empty to hide the email everywhere. */
  email: 'newwavedevelopement@gmail.com' as string,
  phone: '+359 897 269 135',
  location: { city: 'Sofia', country: 'Bulgaria' },
  founders: ['Martin Lichev', 'Stefan Radev'],
  /** Leave a URL empty to hide that social link. */
  socials: {
    github: '',
    linkedin: '',
    facebook: '',
  },
  /** Privacy/Terms pages stay unpublished (404, no links, not in sitemap) until their [TODO] details are filled. */
  legalPublished: false as boolean,
  /** Legal entity details used in the Privacy Policy and Terms. Fill in once registered. */
  legal: {
    company: '[TODO]',
    eik: '[TODO]',
    address: '[TODO]',
    lastUpdated: '[TODO]',
  },
} as const;
