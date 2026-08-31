import { useEffect, useRef, useState } from 'react'
import { useSiteContent } from '../lib/SiteContentContext'

/** White partnerships strip — auto-slides, draggable; logos + copy from CMS */
export default function Clients() {
  const { content, logos } = useSiteContent()
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const draggingRef = useRef(false)
  const lastXRef = useRef(0)
  const loopWidthRef = useRef(0)
  const rafRef = useRef(0)
  const [dragging, setDragging] = useState(false)

  const clients = logos
  const loop = clients.length ? [...clients, ...clients] : []
  const copy = content.clients

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const speed = 0.42

    const measure = () => {
      const el = trackRef.current
      if (!el) return
      loopWidthRef.current = clients.length ? el.scrollWidth / 2 : 0
    }
    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (trackRef.current && ro) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)

    const tick = () => {
      const el = trackRef.current
      const w = loopWidthRef.current
      if (el && !draggingRef.current && !reduce && w > 0) {
        offsetRef.current -= speed
      }
      if (w > 0) {
        while (offsetRef.current <= -w) offsetRef.current += w
        while (offsetRef.current > 0) offsetRef.current -= w
      }
      if (el) el.style.transform = `translate3d(${offsetRef.current}px,0,0)`
      rafRef.current = window.requestAnimationFrame(tick)
    }
    rafRef.current = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', measure)
      ro?.disconnect()
    }
  }, [clients])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!clients.length) return
    draggingRef.current = true
    lastXRef.current = e.clientX
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    offsetRef.current += e.clientX - lastXRef.current
    lastXRef.current = e.clientX
  }

  const endDrag = () => {
    draggingRef.current = false
    setDragging(false)
  }

  return (
    <section id="work" className="scroll-mt-24 relative overflow-hidden clients-strip py-12 text-white md:py-16">
      <div className="color-rail" aria-hidden />

      <div className="site-shell relative z-10 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-brand">
          {copy.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-[clamp(1.55rem,5.4vw,2.4rem)] font-bold tracking-tight text-white">
          {copy.title}
        </h2>
        <p className="mx-auto mt-3 max-w-lg font-serif text-base italic text-white/75 md:text-lg">
          {copy.subtitle}
        </p>
      </div>

      <div
        className={`clients-track relative z-10 mt-8 select-none overflow-hidden md:mt-10 ${
          clients.length ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {loop.length > 0 ? (
          <div
            ref={trackRef}
            className="logo-marquee-track flex w-max items-center px-6 md:px-10"
          >
            {loop.map((client, i) => (
              <div
                key={`${client.id}-${i}`}
                className="logo-box flex h-[5.25rem] w-[15rem] shrink-0 items-center justify-center md:h-[5.75rem] md:w-[16rem]"
                title={client.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.src}
                  alt={client.name}
                  draggable={false}
                  width={300}
                  height={96}
                  className="clients-logo h-14 w-full max-w-[14rem] object-contain object-center select-none md:h-16 md:max-w-[15rem]"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[5.25rem] items-center justify-center px-6 md:h-[5.75rem]">
            <p className="font-serif text-sm italic text-white/45 md:text-base">
              {copy.emptyMessage}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
