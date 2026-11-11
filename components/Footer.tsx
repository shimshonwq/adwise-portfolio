import Logo from './Logo'
import { useSiteContent } from '../lib/SiteContentContext'

export default function Footer() {
  const { content, channels } = useSiteContent()
  const {
    name,
    tagline,
    nav,
    email,
    phoneDisplay,
    footerBlurb,
    footerMeta,
    url,
    footerExploreHeading,
    footerContactHeading,
  } = content.site
  const siteHost = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    }
  })()
  const year = new Date().getFullYear()

  return (
    <footer className="footer-stage py-16">
      <div className="site-shell flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo href="/#top" size="sm" tone="brand" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">{footerBlurb}</p>
          <p className="mt-4 font-display text-lg font-bold text-brand">{tagline}</p>
        </div>

        <div className="flex flex-wrap gap-14 text-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
              {footerExploreHeading}
            </p>
            <ul className="mt-4 space-y-2.5 text-white/55">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={`/${item.href}`} className="hover:text-brand">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
              {footerContactHeading}
            </p>
            <ul className="mt-4 space-y-2.5 text-white/55">
              <li>
                <a href={channels.email} className="hover:text-brand">
                  {email}
                </a>
              </li>
              <li>
                <a href={channels.call} className="hover:text-brand">
                  {phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={channels.whatsapp}
                  className="hover:text-brand"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={url} className="hover:text-brand">
                  {siteHost}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-shell mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.16em] text-white/40 sm:flex-row sm:justify-between">
        <p>
          © {year} {name}
        </p>
        <p>{footerMeta}</p>
      </div>
    </footer>
  )
}
