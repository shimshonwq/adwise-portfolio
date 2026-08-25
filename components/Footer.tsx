import { useMemo } from 'react'
import Logo from './Logo'
import { CmsText } from '../lib/CmsText'
import { DEFAULT_CHANNELS } from '../lib/content'
import { useSiteContent } from '../lib/SiteContentContext'

function navHref(href: string) {
  if (!href) return '/'
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return href
  if (href.startsWith('/')) return href
  if (href.startsWith('#')) return `/${href}`
  return `/${href}`
}

export default function Footer() {
  const { content, channels } = useSiteContent()
  const { name, tagline, nav, email, phoneDisplay, footerBlurb, footerMeta, url, footerExploreHeading, footerContactHeading } =
    content.site
  const siteHost = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    }
  })()
  const year = new Date().getFullYear()
  const explore = useMemo(() => {
    const custom = (content.customPages || [])
      .filter((p) => p.published !== false && p.showInNav && p.slug)
      .map((p) => ({ href: `/p/${p.slug}/`, label: p.title }))
    return [...(nav || []), ...custom]
  }, [nav, content.customPages])
  const waLabel =
    (content.channels || DEFAULT_CHANNELS).find((c) => c.id === 'whatsapp')?.label || 'WhatsApp'

  return (
    <footer className="border-t border-white/10 bg-ink py-14 text-white">
      <div className="site-shell flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo href="/#top" size="sm" bright />
          <CmsText
            path="site.footerBlurb"
            as="p"
            className="mt-4 max-w-xs font-serif text-sm italic leading-relaxed text-white/70"
          >
            {footerBlurb}
          </CmsText>
          <p className="mt-3 max-w-xs text-sm">
            <CmsText path="site.tagline" as="span" className="font-serif text-lg italic text-brand">
              {tagline}
            </CmsText>
          </p>
        </div>

        <div className="flex flex-wrap gap-12 text-sm">
          <div>
            <CmsText path="site.footerExploreHeading" as="p" className="font-semibold text-brand">
              {footerExploreHeading}
            </CmsText>
            <ul className="mt-3 space-y-2 text-white/55">
              {explore.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <a href={navHref(item.href)} className="hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <CmsText path="site.footerContactHeading" as="p" className="font-semibold text-brand">
              {footerContactHeading}
            </CmsText>
            <ul className="mt-3 space-y-2 text-white/55">
              <li>
                <a href={channels.email} className="hover:text-white">
                  {email}
                </a>
              </li>
              <li>
                <a href={channels.call} className="hover:text-white">
                  {phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={channels.whatsapp}
                  className="hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {waLabel}
                </a>
              </li>
              <li>
                <a href={url} className="hover:text-white">
                  {siteHost}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-shell mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:justify-between">
        <p>
          © {year} {name}
        </p>
        <CmsText path="site.footerMeta" as="p">
          {footerMeta}
        </CmsText>
      </div>
    </footer>
  )
}
