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
            ? 'border-b border-line bg-paper/95'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="color-rail" aria-hidden />
        <nav className="site-shell flex h-16 items-center justify-between md:h-20">
          <Logo href="/#top" size="sm" tone={scrolled || open ? 'ink' : 'brand'} />

          <div
            className={`hidden items-center gap-8 rounded-xl px-5 py-3 md:flex ${
              scrolled ? '' : 'border border-ink/10 bg-white/80 shadow-sm backdrop-blur-md'
            }`}
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={`/${item.href}`}
                className="text-sm font-medium tracking-wide text-ink/70 transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ))}
            <a href={navCtaHref || '/#contact'} className="btn btn-primary !py-2.5 !px-5">
              {navCta}
            </a>
          </div>

          <button
            type="button"
            id="mobile-menu-button"
            className="relative z-[70] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-ink/15 bg-white md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu-panel"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`block h-0.5 w-6 bg-ink transition ${open ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span className={`block h-0.5 w-6 bg-ink transition ${open ? 'opacity-0' : ''}`} />
            <span
              className={`block h-0.5 w-6 bg-ink transition ${open ? '-translate-y-2 -rotate-45' : ''}`}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-paper md:hidden"
          >
            <div className="color-rail" aria-hidden />
            <div className="site-shell flex h-full flex-col justify-center gap-3 pt-20 pb-10">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={`/${item.href}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="font-display text-[clamp(1.55rem,7vw,2.5rem)] font-bold tracking-tight text-ink"
                >
                  {item.label}
                </motion.a>
              ))}
              <a
                href={navCtaHref || '/#contact'}
                onClick={() => setOpen(false)}
                className="btn btn-brand mt-8 w-fit"
              >
                {navCta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
