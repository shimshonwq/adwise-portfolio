import { useEffect, useRef, useState } from 'react'
import { useSiteContent } from '../lib/SiteContentContext'

/** Partnerships strip — dark stage, auto-slide, optional logo links */
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
    const speed = Number(copy.marqueeSpeed) > 0 ? Number(copy.marqueeSpeed) : 0.42
    let visible = true

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
      if (el && !draggingRef.current && !reduce && w > 0 && visible) {
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

    const section = trackRef.current?.closest('section')
    const io =
      section && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              visible = entries.some((entry) => entry.isIntersecting)
            },
            { rootMargin: '120px' },
          )
        : null
    if (section && io) io.observe(section)

    return () => {
      window.cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', measure)
      ro?.disconnect()
      io?.disconnect()
    }
  }, [clients, copy.marqueeSpeed])

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
    <section id="work" className="clients-stage scroll-mt-24 relative overflow-hidden py-14 md:py-20">
      <div className="site-shell relative z-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow !text-brand">{copy.eyebrow}</p>
            <h2 className="mt-3 font-display text-[clamp(1.7rem,4.5vw,2.8rem)] font-extrabold tracking-tight text-white">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/55 md:text-right">{copy.subtitle}</p>
        </div>
      </div>

      <div
        className={`relative z-10 mt-10 select-none overflow-hidden ${
          clients.length ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {loop.length > 0 ? (
          <div ref={trackRef} className="clients-track px-6 md:px-10">
            {loop.map((client, i) => {
              const logoImg = (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={client.src}
                  alt={client.name}
                  draggable={false}
                  width={300}
                  height={96}
                  className="clients-logo"
                />
              )
              const href = String(client.url || '').trim()
              const external = href.startsWith('http://') || href.startsWith('https://')
              return (
                <div
                  key={`${client.id}-${i}`}
                  className="flex h-16 w-40 shrink-0 items-center justify-center md:h-20 md:w-48"
                  title={client.name}
                >
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-full w-full items-center justify-center"
                      aria-label={`Visit ${client.name}`}
                    >
                      {logoImg}
                    </a>
                  ) : (
                    logoImg
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex h-16 items-center justify-center px-6">
            <p className="text-sm text-white/45">{copy.emptyMessage}</p>
          </div>
        )}
      </div>
    </section>
  )
}
