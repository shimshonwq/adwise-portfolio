import { useSiteContent } from '../lib/SiteContentContext'
import { DEFAULT_CONTENT, contactChannelsFromSite } from '../lib/content'

/** Structured data so Google can understand Adwise Media as a business entity. */
export default function JsonLd() {
  const { content } = useSiteContent()
  const site = content.site || DEFAULT_CONTENT.site
  const channels = contactChannelsFromSite(site)
  const phone = String(site.phone || '').replace(/\D/g, '')
  const telephone =
    phone.length >= 10
      ? `+1-${phone.slice(-10, -7)}-${phone.slice(-7, -4)}-${phone.slice(-4)}`
      : site.phoneDisplay

  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    url: site.url,
    image: `${site.url}/logo.png`,
    description: site.description,
    email: site.email,
    telephone,
    areaServed: 'Worldwide',
    sameAs: [channels.whatsapp],
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
