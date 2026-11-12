import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import { useSiteContent } from '../lib/SiteContentContext'

export default function Navigation() {
  const { content } = useSiteContent()
  const { nav, navCta, navCtaHref } = content.site
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 transition-[background,border-color] duration-300 ${
          open ? 'z-[70]' : 'z-50'
        } ${
          scrolled || open
            ? 'nav-shell border-b border-white/10 bg-ink/95'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="color-rail" aria-hidden />
        <nav className="site-shell flex h-16 items-center justify-between md:h-[4.5rem]">
          <Logo href="/#top" size="sm" tone="brand" />

          <div className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <a key={item.href} href={`/${item.href}`} className="nav-link">
                {item.label}
              </a>
            ))}
            <a href={navCtaHref || '/#contact'} className="btn btn-primary !px-5 !py-2.5">
              {navCta}
            </a>
          </div>

          <button
            type="button"
            id="mobile-menu-button"
            className="relative z-[70] flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-white/20 bg-ink md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu-panel"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`block h-0.5 w-5 bg-brand transition ${open ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span className={`block h-0.5 w-5 bg-brand transition ${open ? 'opacity-0' : ''}`} />
            <span
              className={`block h-0.5 w-5 bg-brand transition ${open ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-button"
            className="nav-mobile fixed inset-0 z-[60] flex flex-col px-6 pb-10 pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-1 flex-col gap-6">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={`/${item.href}`}
                  className="font-display text-2xl font-extrabold tracking-tight text-white"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i }}
                  onClick={() => setOpen(false)}
                >
                  <span className="mr-3 text-brand">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </motion.a>
              ))}
            </div>
            <a
              href={navCtaHref || '/#contact'}
              className="btn btn-primary w-full"
              onClick={() => setOpen(false)}
            >
              {navCta}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
