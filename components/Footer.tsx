import Logo from './Logo'
import { useSiteContent } from '../lib/SiteContentContext'

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

  return (
    <footer className="border-t border-white/10 bg-ink py-14 text-white">
      <div className="site-shell flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo href="/#top" size="sm" bright />
          <p className="mt-4 max-w-xs font-serif text-sm italic leading-relaxed text-white/70">
            {footerBlurb}
          </p>
          <p className="mt-3 max-w-xs text-sm">
            <span className="font-serif text-lg italic text-brand">{tagline}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-12 text-sm">
          <div>
            <p className="font-semibold text-brand">{footerExploreHeading}</p>
            <ul className="mt-3 space-y-2 text-white/55">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={`/${item.href}`} className="hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-brand">{footerContactHeading}</p>
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
                  WhatsApp
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
        <p>{footerMeta}</p>
      </div>
    </footer>
  )
}
