/** Partnerships / clients strip — empty until fresh logos are uploaded */
export default function Clients() {
  return (
    <section id="work" className="scroll-mt-24 relative overflow-hidden bg-ink py-16 text-white md:py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 80% 20%, rgba(253,198,33,0.14), transparent 55%)',
        }}
        aria-hidden
      />

      <div className="site-shell relative z-10 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-brand">
          Some of our partnerships
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Brands we work with
        </h2>
        <p className="mx-auto mt-10 max-w-lg rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-6 py-10 text-sm leading-relaxed text-white/50">
          Client logos cleared and ready. Upload your new logo files and we’ll place them here in
          one clean row.
        </p>
      </div>
    </section>
  )
}
