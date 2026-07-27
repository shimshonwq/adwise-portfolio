import { useEffect, useRef, useState } from 'react'

type Client = {
  name: string
  src: string
}

const clients: Client[] = [
  { name: 'The Shvitz', src: '/clients/shvitz.png' },
  { name: 'Ride 24', src: '/clients/ride-24.png' },
  { name: 'Garden Gourmet', src: '/clients/garden-gourmet.png' },
  { name: 'HVN', src: '/clients/hvn.png' },
  { name: 'Reel Talk Show', src: '/clients/tik-talk-show.png' },
  { name: 'Shloimy Friedlander', src: '/clients/shloimy.png' },
  { name: 'Green Power Electric', src: '/clients/greenpower.png' },
  { name: 'Planit Architecture', src: '/clients/planit.png' },
  { name: 'Gebecks Bakery', src: '/clients/gebecks.png' },
  { name: 'Coffee Break', src: '/clients/coffee-break.png' },
  { name: 'iContact Studio', src: '/clients/icontact.png' },
  { name: 'Vish-Vash', src: '/clients/vish-vash.png' },
  { name: 'Shloimis', src: '/clients/artisan.png' },
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
        el.scrollLeft += dt * 0.035
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
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/50 md:text-base">
          Logos and campaigns for the brands we help grow.
        </p>
      </div>

      <div
        ref={trackRef}
        className="clients-track relative z-10 mt-8 cursor-grab active:cursor-grabbing md:mt-10"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="flex w-max items-center gap-10 px-8 md:gap-14 md:px-12">
          {loop.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex h-14 w-[7.5rem] shrink-0 items-center justify-center md:h-16 md:w-40"
              title={client.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={client.src}
                alt={client.name}
                draggable={false}
                className="max-h-full max-w-full object-contain opacity-90 select-none transition duration-300 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
