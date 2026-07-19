/**
 * Single source of truth for site-wide content.
 */
export const siteConfig = {
  name: 'Adwise Media',
  shortName: 'Adwise',
  tagline: 'Thinkink Your Next Thing',
  description:
    'Adwise Media is a creative studio for marketing, content creation, and graphic design — helping brands look sharper and grow faster.',
  url: 'https://adwisemedia.co',
  email: 'adwisecreativity@gmail.com',
  phone: '8455515506',
  phoneDisplay: '(845) 551-5506',
  location: 'Available worldwide',

  socialLinks: {
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
    twitter: 'https://twitter.com/',
    behance: '',
  },

  nav: [
    { href: '#work', label: 'Work' },
    { href: '#services', label: 'Services' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ],
}

export type SiteConfig = typeof siteConfig
