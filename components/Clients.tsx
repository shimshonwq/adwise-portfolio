import { useEffect, useRef, useState } from 'react'

const clients = [
  { name: 'Shloimy Friedlander Productions', src: '/clients/shloimy.png' },
  { name: 'Coffee Break', src: '/clients/coffee-break.png' },
  { name: 'Planit Architecture', src: '/clients/planit.png' },
  { name: 'Green Power Electric', src: '/clients/greenpower.png' },
  { name: 'Vish-Vash Car Wash', src: '/clients/vish-vash.png' },
  { name: 'iContact Studio', src: '/clients/icontact.png' },
  { name: 'Gebecks Bakery', src: '/clients/gebecks.png' },
  { name: 'Artisan', src: '/clients/artisan.png' },
]

/** Swipeable / scrolling client logo row */
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
        el.scrollLeft += dt * 0.045
        const half = el.scrollWidth / 2
        if (half > 0 && el.scrollLeft >= half) {
          el.scrollLeft -= half
        }
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
    const dx = e.clientX - drag.current.startX
    el.scrollLeft = drag.current.scrollLeft - dx
  }

  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current.active) return
    drag.current.active = false
    try {
      trackRef.current?.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setPaused(false), 1200)
  }

  const loop = [...clients, ...clients]

  return (
    <section id="work" className="scroll-mt-24 relative overflow-hidden section-aurora-deep grain py-16 md:py-20">
      <div className="site-shell relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our clients</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Brands we advertise &amp; design for
          </h2>
          <p className="mt-3 text-base text-ink/55 md:text-lg">
            Marketing, graphics, and media for companies that want to stand out.
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        className="clients-track relative z-10 mt-10 cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <div className="flex w-max items-center gap-10 px-8 md:gap-14 md:px-12">
          {loop.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex h-16 w-[7.5rem] shrink-0 items-center justify-center md:h-20 md:w-40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={client.src}
                alt={client.name}
                draggable={false}
                className="max-h-full max-w-full object-contain select-none"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
