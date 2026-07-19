import { siteConfig } from '../config/site.config'

/** Structured data so Google can understand Adwise Media as a business entity. */
export default function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: `+1-${siteConfig.phone.slice(0, 3)}-${siteConfig.phone.slice(3, 6)}-${siteConfig.phone.slice(6)}`,
    areaServed: 'Worldwide',
    sameAs: [siteConfig.contactChannels.whatsapp],
    priceRange: '$$',
    knowsAbout: [
      'Logo design',
      'Brand identity',
      'Graphic design',
      'Marketing',
      'Content creation',
      'Signage design',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
