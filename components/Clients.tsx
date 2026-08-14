type Client = {
  name: string
  src: string
  /** Keep original brand colors (skip white filter) */
  keepColor?: boolean
}

/** Client logos for the slow-sliding partnerships strip */
const clients: Client[] = [
  { name: 'The Shvitz', src: '/clients/shvitz.png' },
  { name: 'Kalmys', src: '/clients/shloimis.png' },
  { name: 'iContact Studio', src: '/clients/icontact.png' },
  { name: 'HVN', src: '/clients/hvn.png' },
  { name: 'Garden Gourmet', src: '/clients/garden-gourmet.png' },
  { name: 'Shloimy Friedlander', src: '/clients/shloimy.png' },
  { name: 'Planit Architecture', src: '/clients/planit.png' },
  { name: 'Ride 24', src: '/clients/ride-24.png' },
  { name: 'Reel Show', src: '/clients/reel-show.png' },
  { name: 'Flavor Max', src: '/clients/flavor-max.png' },
  { name: 'Vish-Vash', src: '/clients/vish-vash.png' },
  { name: 'Coffee Break', src: '/clients/coffee-break.png' },
  { name: 'Green Power Electric', src: '/clients/greenpower.png' },
  { name: 'Mendel Style Events', src: '/clients/mendel-style.png', keepColor: true },
]

/** Uniform slow-sliding client logo row — always moving */
export default function Clients() {
  const loop = [...clients, ...clients]

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
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-brand">
          Some of our partnerships
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
          Brands we work with
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/70 md:text-base">
          Logos and campaigns for the brands we help grow.
        </p>
      </div>

      <div className="clients-track relative z-10 mt-8 overflow-hidden md:mt-10">
        <div className="logo-marquee-track flex w-max items-center gap-0 px-6 md:px-10">
          {loop.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="logo-box flex h-[5.25rem] w-[15rem] shrink-0 items-center justify-center px-3 md:h-[5.75rem] md:w-[16rem]"
              title={client.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={client.src}
                alt={client.name}
                draggable={false}
                width={260}
                height={100}
                className={`h-14 w-[14rem] object-contain object-center opacity-95 select-none md:h-16 md:w-[15rem] ${
                  client.keepColor ? 'logo-keep-color' : ''
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
