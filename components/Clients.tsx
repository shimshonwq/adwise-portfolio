import { useEffect, useRef, useState } from 'react'

type Client = {
  name: string
  src: string
  /** light logos need a dark tile; dark logos need a light tile */
  tile: 'light' | 'dark'
}

const clients: Client[] = [
  { name: 'The Shvitz', src: '/clients/shvitz.png', tile: 'dark' },
  { name: 'Ride 24', src: '/clients/ride-24.png', tile: 'dark' },
  { name: 'Garden Gourmet', src: '/clients/garden-gourmet.png', tile: 'dark' },
  { name: 'HVN', src: '/clients/hvn.png', tile: 'dark' },
  { name: 'Reel Show', src: '/clients/reel-show.png', tile: 'dark' },
  { name: 'Shloimy Friedlander', src: '/clients/shloimy.png', tile: 'dark' },
  { name: 'Green Power Electric', src: '/clients/greenpower.png', tile: 'light' },
  { name: 'Planit Architecture', src: '/clients/planit.png', tile: 'light' },
  { name: 'Gebecks Bakery', src: '/clients/gebecks.png', tile: 'light' },
  { name: 'Coffee Break', src: '/clients/coffee-break.png', tile: 'light' },
  { name: 'iContact Studio', src: '/clients/icontact.png', tile: 'light' },
  { name: 'Vish-Vash', src: '/clients/vish-vash.png', tile: 'dark' },
  { name: 'Artisan', src: '/clients/artisan.png', tile: 'light' },
]

/** Compact swipeable client logo row */
export default function Clients() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 })

  useEffect(() => {
    const el = trackRef.current
    if (!el || paused) return
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = now - last
      last = now
      if (!drag.current.active) {
        el.scrollLeft += dt * 0.04
        const half = el.scrollWidth / 2
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (!el) return
    drag.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft }
    setPaused(true)
    el.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (!el || !drag.current.active) return
    el.scrollLeft = drag.current.scrollLeft - (e.clientX - drag.current.startX)
  }

  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current.active) return
    drag.current.active = false
    try {
      trackRef.current?.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setPaused(false), 900)
  }

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
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-brand">Our clients</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Brands we advertise
        </h2>
      </div>

      <div
        ref={trackRef}
        className="clients-track relative z-10 mt-8 cursor-grab active:cursor-grabbing md:mt-10"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="flex w-max items-center gap-4 px-6 md:gap-5 md:px-10">
          {loop.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className={`flex h-16 w-28 shrink-0 items-center justify-center rounded-2xl px-3 md:h-[4.5rem] md:w-36 ${
                client.tile === 'dark'
                  ? 'bg-white/5 ring-1 ring-white/10'
                  : 'bg-white ring-1 ring-white/15'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={client.src}
                alt={client.name}
                draggable={false}
                className="max-h-10 max-w-full object-contain select-none md:max-h-12"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
