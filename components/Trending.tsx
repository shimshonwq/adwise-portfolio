/** Pivot-style “now trending” idea strip — short brand lines in motion */
const trends = [
  'Turn heads and profits™',
  'Look expensive on purpose™',
  'Design that earns attention™',
  'Craft that closes deals™',
  'Brands people remember™',
  'From first mark to full campaign™',
]

export default function Trending() {
  const loop = [...trends, ...trends]

  return (
    <section className="overflow-hidden border-y border-ink/10 bg-paper-deep py-10 md:py-12">
      <div className="site-shell mb-6 text-center md:mb-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-ink/40">Now trending</p>
      </div>
      <div className="marquee-track flex gap-10 whitespace-nowrap px-6 md:gap-14">
        {loop.map((line, i) => (
          <span
            key={`${line}-${i}`}
            className="inline-flex items-center gap-10 font-display text-2xl font-bold tracking-tight text-ink md:gap-14 md:text-3xl"
          >
            {line}
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand" aria-hidden />
          </span>
        ))}
      </div>
    </section>
  )
}
