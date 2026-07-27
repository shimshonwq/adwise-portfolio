/** Client logo row — empty until fresh transparent logos are attached */
export default function Clients() {
  return (
    <section id="work" className="scroll-mt-24 relative overflow-hidden bg-ink py-14 text-white md:py-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 80% 20%, rgba(253,198,33,0.12), transparent 55%)',
        }}
        aria-hidden
      />

      <div className="site-shell relative z-10 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-brand">Our clients</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Brands we advertise
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/50 md:text-base">
          Logos and campaigns for the brands we help grow.
        </p>
        <p className="mx-auto mt-10 max-w-md rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-6 py-8 text-sm text-white/45">
          Client logos cleared — re-attach your transparent logo files and we’ll place them here.
        </p>
      </div>
    </section>
  )
}
