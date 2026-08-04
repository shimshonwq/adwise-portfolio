/**
 * Site content — edit this file to update contact details.
 * Phone is used for WhatsApp, SMS, and Call links.
 */
export const siteConfig = {
  name: 'Adwise Media',
  shortName: 'Adwise',
  tagline: 'Thinking Your Next Thing',
  description:
    'Logo design, brand graphics, and marketing for businesses that want to look sharp and get noticed.',
  url: 'https://adwisemedia.co',
  email: 'adwisecreativity@gmail.com',
  phone: '8455515506',
  phoneDisplay: '(845) 551-5506',
  location: 'Available worldwide',

  /** Direct contact channels (shown as icons sitewide) */
  contactChannels: {
    whatsapp: 'https://wa.me/18455515506',
    email: 'mailto:adwisecreativity@gmail.com',
    call: 'tel:+18455515506',
    sms: 'sms:+18455515506',
  },

  nav: [
    { href: '#work', label: 'Clients' },
    { href: '#services', label: 'Services' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ],
}

export type SiteConfig = typeof siteConfig
