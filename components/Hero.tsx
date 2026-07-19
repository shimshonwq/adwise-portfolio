import { siteConfig } from '../config/site.config'

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      {/* Full-bleed brand visual plane */}
      <div className="absolute inset-0 -z-10 bg-[#f6f4f0]" aria-hidden>
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 78% 42%, rgb(253 198 33 / 0.5), transparent 62%), radial-gradient(ellipse 45% 40% at 12% 78%, rgb(253 198 33 / 0.22), transparent 55%)',
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tagline-hero.png"
          alt=""
          className="pointer-events-none absolute left-1/2 top-[8%] w-[120%] max-w-none -translate-x-1/2 select-none opacity-40 sm:opacity-50 lg:left-auto lg:right-[-8%] lg:top-1/2 lg:w-[58%] lg:translate-x-0 lg:-translate-y-1/2 lg:opacity-[0.92]"
        />
        {/* Soft vignette so type stays readable over art */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#f6f4f0]/70 via-[#f6f4f0]/55 to-[#f6f4f0] lg:bg-gradient-to-r lg:from-[#f6f4f0] lg:via-[#f6f4f0]/88 lg:to-transparent"
          aria-hidden
        />
      </div>

      <div className="site-shell relative flex min-h-[100svh] flex-col justify-end pb-24 pt-28 md:justify-center md:pb-28 md:pt-32">
        <div className="reveal max-w-2xl">
          {/* Brand as hero-level signal */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt={siteConfig.name}
            width={420}
            height={130}
            className="mb-9 h-14 w-auto md:mb-11 md:h-20"
          />

          <h1 className="font-display text-[clamp(2.85rem,7.5vw,5.5rem)] font-extrabold leading-[0.94] tracking-tight text-ink">
            Thinkink your
            <br />
            <span className="text-brand-deep">next thing.</span>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-ink/65 md:text-xl">
            Marketing, content, and graphic design for brands that refuse to blend in.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="bg-ink px-7 py-3.5 text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-brand hover:text-ink"
            >
              See the work
            </a>
            <a
              href="#contact"
              className="border border-ink/25 bg-transparent px-7 py-3.5 text-sm font-semibold tracking-wide text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              Start a project
            </a>
          </div>
        </div>
      </div>

      {/* Intentional motion: brand presence marquee */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-ink/10 bg-ink py-3.5 text-brand">
        <div className="marquee-track flex gap-12 whitespace-nowrap px-6 text-xs font-semibold tracking-[0.22em] uppercase md:text-sm">
          {Array.from({ length: 2 }).map((_, loop) => (
            <div key={loop} className="flex gap-12">
              {[
                'Marketing',
                'Content Creation',
                'Graphic Design',
                'Brand Identity',
                'Social Strategy',
                'Campaigns',
              ].map((label) => (
                <span key={`${loop}-${label}`} className="inline-flex items-center gap-12">
                  {label}
                  <span className="inline-block h-1.5 w-1.5 bg-brand" aria-hidden />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
