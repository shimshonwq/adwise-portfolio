/**
 * Single source of truth for site-wide content.
 * Edit the values below to personalize the site — no need to touch components.
 */
export const siteConfig = {
  name: 'Adwise Media',
  shortName: 'Adwise',
  tagline: 'Marketing · Content Creation · Graphic Design',
  description:
    'Adwise Media is a creative studio helping brands grow through strategic marketing, scroll-stopping content, and standout graphic design.',
  // Update this to your live Cloudflare domain (used for SEO / social tags).
  url: 'https://adwisemedia.com',

  // Contact details — update these.
  email: 'hello@adwisemedia.com',
  phone: '',
  location: 'Available worldwide · Remote',

  socialLinks: {
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
    twitter: 'https://twitter.com/',
    behance: '',
  },

  nav: [
    { href: '#services', label: 'Services' },
    { href: '#work', label: 'Work' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ],

  stats: [
    { value: '150+', label: 'Projects delivered' },
    { value: '60+', label: 'Happy clients' },
    { value: '250%', label: 'Avg. engagement lift' },
    { value: '7+', label: 'Years of craft' },
  ],
}

export type SiteConfig = typeof siteConfig
