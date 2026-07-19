import { siteConfig } from '../config/site.config'

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-paper">
      <div className="gold-field absolute inset-0 -z-10" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-[2%] w-[140%] -translate-x-1/2 opacity-25 lg:left-auto lg:right-[-10%] lg:top-1/2 lg:w-[58%] lg:translate-x-0 lg:-translate-y-1/2 lg:opacity-90">
        <div className="motion-safe:animate-[float_18s_ease-in-out_infinite]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tagline-hero.png" alt="" className="w-full max-w-none select-none" />
        </div>
      </div>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-paper/85 via-paper/55 to-paper lg:bg-gradient-to-r lg:from-paper lg:via-paper/90 lg:to-transparent"
        aria-hidden
      />

      <div className="site-shell relative flex min-h-[100svh] flex-col justify-end pb-16 pt-28 md:justify-center md:pb-24 md:pt-32">
        <div className="reveal max-w-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt={siteConfig.name}
            width={420}
            height={130}
            className="mb-10 h-14 w-auto md:mb-12 md:h-[4.5rem]"
          />

          <h1 className="font-display text-[clamp(2.9rem,7.2vw,5.4rem)] font-extrabold leading-[0.94] tracking-tight text-ink">
            Identity work
            <br />
            <span className="text-brand-deep">worth staring at.</span>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-ink/55 md:text-xl">
            Logo design, branding, and visual systems for companies that want to look as good as they
            perform.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn btn-primary">
              See the work
            </a>
            <a href="#contact" className="btn btn-secondary">
              Start a project
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
