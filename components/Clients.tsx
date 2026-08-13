import { useState } from 'react'

type Client = {
  name: string
  src: string
}

/** Client logos for the slow-sliding partnerships strip */
const clients: Client[] = [
  { name: 'The Shvitz', src: '/clients/shvitz.png' },
  { name: 'Green Power Electric', src: '/clients/greenpower.png' },
  { name: 'Gebecks', src: '/clients/shloimis.png' },
  { name: 'iContact Studio', src: '/clients/icontact.png' },
  { name: 'Vish-Vash', src: '/clients/vish-vash.png' },
  { name: 'HVN', src: '/clients/hvn.png' },
  { name: 'Garden Gourmet', src: '/clients/garden-gourmet.png' },
  { name: 'Shloimy Friedlander', src: '/clients/shloimy.png' },
  { name: 'Planit Architecture', src: '/clients/planit.png' },
  { name: 'Coffee Break', src: '/clients/coffee-break.png' },
  { name: 'Ride 24', src: '/clients/ride-24.png' },
  { name: 'Reel Show', src: '/clients/reel-show.png' },
]

/** Uniform slow-sliding client logo row */
export default function Clients() {
  const [paused, setPaused] = useState(false)
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

      <div
        className="clients-track relative z-10 mt-8 overflow-hidden md:mt-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div
          className={`logo-marquee-track flex w-max items-center gap-0 px-6 md:px-10 ${
            paused ? 'is-paused' : ''
          }`}
        >
          {loop.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="logo-box flex h-[4.5rem] w-[12.5rem] shrink-0 items-center justify-center px-2 md:h-20 md:w-[12.5rem]"
              title={client.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={client.src}
                alt={client.name}
                draggable={false}
                width={200}
                height={72}
                className="h-[3.25rem] w-[12.5rem] object-contain object-center opacity-95 select-none transition duration-300 hover:opacity-100 md:h-14"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
