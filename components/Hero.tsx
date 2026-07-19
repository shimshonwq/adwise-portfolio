import { siteConfig } from '../config/site.config'
import ContactChannels from './ContactChannels'

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <div className="gold-field absolute inset-0 -z-10" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/tagline-hero.png"
        alt=""
        className="pointer-events-none absolute left-1/2 top-[6%] w-[125%] max-w-none -translate-x-1/2 select-none opacity-35 lg:left-auto lg:right-[-10%] lg:top-1/2 lg:w-[56%] lg:translate-x-0 lg:-translate-y-1/2 lg:opacity-90"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-paper/75 via-paper/55 to-paper lg:bg-gradient-to-r lg:from-paper lg:via-paper/90 lg:to-transparent"
        aria-hidden
      />

      <div className="site-shell relative flex min-h-[100svh] flex-col justify-end pb-24 pt-28 md:justify-center md:pb-28 md:pt-32">
        <div className="reveal max-w-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt={siteConfig.name}
            width={420}
            height={130}
            className="mb-9 h-14 w-auto md:mb-11 md:h-[4.75rem]"
          />

          <h1 className="font-display text-[clamp(2.9rem,7.2vw,5.4rem)] font-extrabold leading-[0.95] text-ink">
            Logos &amp; brands that
            <br />
            <span className="text-brand-deep">earn a second look.</span>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-ink/60 md:text-xl">
            {siteConfig.name} — marketing, content, and graphic design. Built for brands that refuse
            to blend in.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn btn-primary">
              Browse the work
            </a>
            <a href="#contact" className="btn btn-secondary">
              Start a project
            </a>
          </div>

          <ContactChannels className="mt-10" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-ink/10 bg-ink py-3.5 text-brand">
        <div className="marquee-track flex gap-12 whitespace-nowrap px-6 text-xs font-semibold tracking-[0.22em] uppercase md:text-sm">
          {Array.from({ length: 2 }).map((_, loop) => (
            <div key={loop} className="flex gap-12">
              {['Logo Design', 'Brand Identity', 'Signage', 'Content', 'Marketing', 'Print'].map(
                (label) => (
                  <span key={`${loop}-${label}`} className="inline-flex items-center gap-12">
                    {label}
                    <span className="inline-block h-1.5 w-1.5 bg-brand" aria-hidden />
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
