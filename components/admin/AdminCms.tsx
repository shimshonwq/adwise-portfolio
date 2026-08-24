import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_CONTENT,
  type CmsContent,
  type LogoItem,
} from '../../lib/content'

type Phase = 'checking' | 'login' | 'app'
type Tab =
  | 'logos'
  | 'site'
  | 'hero'
  | 'clients'
  | 'services'
  | 'spotlight'
  | 'process'
  | 'about'
  | 'contact'

const TABS: { id: Tab; label: string }[] = [
  { id: 'logos', label: 'Logos' },
  { id: 'site', label: 'Site & contact' },
  { id: 'hero', label: 'Hero' },
  { id: 'clients', label: 'Clients section' },
  { id: 'services', label: 'Services' },
  { id: 'spotlight', label: 'Spotlight' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact page' },
]

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

function Field({
  label,
  value,
  onChange,
  multiline,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  hint?: string
}) {
  const cls =
    'w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm outline-none transition focus:border-brand'
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-ink/70">{label}</span>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${cls} resize-y`}
        />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {hint && <span className="mt-1 block text-xs text-ink/45">{hint}</span>}
    </label>
  )
}

function sortedLogos(logos: LogoItem[]) {
  return [...logos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export default function AdminCms() {
  const [phase, setPhase] = useState<Phase>('checking')
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState<Tab>('logos')
  const [content, setContent] = useState<CmsContent>(DEFAULT_CONTENT)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadName, setUploadName] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const logos = useMemo(() => sortedLogos(content.logos || []), [content.logos])

  const loadContent = useCallback(async () => {
    const res = await fetch('/api/admin/content/', { credentials: 'include' })
    if (!res.ok) throw new Error('Session expired — log in again')
    const data = await res.json()
    setContent(data.content || DEFAULT_CONTENT)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/session/', { credentials: 'include' })
        const data = await res.json()
        if (cancelled) return
        if (data.ok) {
          await loadContent()
          if (!cancelled) setPhase('app')
        } else setPhase('login')
      } catch {
        if (!cancelled) {
          setPhase('login')
          setError('Admin API is not running. Use npm run dev (starts the API automatically).')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loadContent])

  const flash = (ok: string) => {
    setMessage(ok)
    setError(null)
  }

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      await loadContent()
      setPassword('')
      setPhase('app')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  const onLogout = async () => {
    await fetch('/api/admin/logout/', { method: 'POST', credentials: 'include' })
    setPhase('login')
  }

  const saveContent = async (next: CmsContent, okMsg = 'Saved — live site updates right away.') => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/content/', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: next }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setContent(data.content)
      flash(okMsg)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const moveLogo = async (id: string, dir: -1 | 1) => {
    const list = sortedLogos(content.logos)
    const i = list.findIndex((l) => l.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= list.length) return
    const ids = list.map((l) => l.id)
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/logos/reorder/', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Reorder failed')
      if (data.content) setContent(data.content)
      else await loadContent()
      flash('Logo order updated.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reorder failed')
    } finally {
      setBusy(false)
    }
  }

  const patchLogo = async (id: string, patch: { name?: string; visible?: boolean }) => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/logos/${encodeURIComponent(id)}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')
      if (data.content) setContent(data.content)
      else await loadContent()
      flash('Logo updated.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  const removeLogo = async (id: string) => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/logos/${encodeURIComponent(id)}/`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not remove')
      if (data.content) setContent(data.content)
      else await loadContent()
      flash('Logo removed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove')
    } finally {
      setBusy(false)
    }
  }

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) {
      setError('Choose a logo file first')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const dataUrl = await readFileAsDataUrl(uploadFile)
      const res = await fetch('/api/admin/logos/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: uploadName.trim() || uploadFile.name.replace(/\.[^.]+$/, ''),
          dataUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      if (data.content) setContent(data.content)
      else await loadContent()
      setUploadName('')
      setUploadFile(null)
      if (fileRef.current) fileRef.current.value = ''
      flash('Logo added to the bar.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-paper text-ink">
      <div className="color-rail" aria-hidden />
      <div className="site-shell py-10 md:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brass">
              Private admin
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Edit your website
            </h1>
            <p className="mt-2 max-w-xl font-serif text-base italic text-ink/70">
              Change logos, contact info, headlines, and section copy. Saves update the live site —
              no code needed. Only at /login (not linked publicly).
            </p>
          </div>
          {phase === 'app' && (
            <div className="flex flex-wrap gap-2">
              <a href="/" className="btn btn-secondary text-sm" target="_blank" rel="noreferrer">
                View site
              </a>
              <button type="button" onClick={onLogout} className="btn btn-secondary text-sm">
                Log out
              </button>
            </div>
          )}
        </div>

        {phase === 'checking' && (
          <p className="font-serif italic text-ink/55">Checking session…</p>
        )}

        {phase === 'login' && (
          <form
            onSubmit={onLogin}
            className="soft-panel mx-auto max-w-md space-y-5 border border-ink/10 bg-white p-7 md:p-9"
          >
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink/70">Password</span>
              <input
                type="password"
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm outline-none focus:border-brand"
                placeholder="Admin password"
                required
              />
              <span className="mt-1 block text-xs text-ink/45">
                Same password you set on Cloudflare (local default: adwise-admin)
              </span>
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={busy} className="btn btn-primary w-full">
              {busy ? 'Signing in…' : 'Log in'}
            </button>
          </form>
        )}

        {phase === 'app' && (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTab(t.id)
                    setMessage(null)
                    setError(null)
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    tab === t.id
                      ? 'border-ink bg-ink text-white'
                      : 'border-ink/15 bg-white text-ink/70 hover:border-ink/40'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {(message || error) && (
              <p className={`mb-4 text-sm ${error ? 'text-red-700' : 'text-emerald-800'}`}>
                {error || message}
              </p>
            )}

            {tab === 'logos' && (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <form
                  onSubmit={onUpload}
                  className="soft-panel h-fit space-y-4 border border-ink/10 bg-white p-6"
                >
                  <h2 className="font-display text-xl font-bold">Add a logo</h2>
                  <p className="font-serif text-sm italic text-ink/60">
                    PNG, JPG, WebP, or SVG. Original colors kept.
                  </p>
                  <Field label="Client name" value={uploadName} onChange={setUploadName} />
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-medium text-ink/70">Logo file</span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-2 file:font-semibold"
                      required
                    />
                  </label>
                  <button type="submit" disabled={busy || !uploadFile} className="btn btn-primary">
                    {busy ? 'Uploading…' : 'Add to logo bar'}
                  </button>
                </form>

                <div>
                  <h2 className="font-display text-xl font-bold">
                    Logo bar order ({logos.length})
                  </h2>
                  <p className="mt-1 font-serif text-sm italic text-ink/60">
                    Use ↑ ↓ to reorder. Rename, hide, or remove anytime.
                  </p>
                  <ul className="mt-5 space-y-2">
                    {logos.map((logo, index) => (
                      <li
                        key={logo.id}
                        className={`flex flex-wrap items-center gap-3 rounded-xl border bg-white px-3 py-2.5 ${
                          logo.visible === false ? 'border-dashed border-ink/20 opacity-60' : 'border-ink/10'
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            disabled={busy || index === 0}
                            onClick={() => moveLogo(logo.id, -1)}
                            className="rounded border border-ink/15 px-2 py-0.5 text-xs disabled:opacity-30"
                            aria-label="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={busy || index === logos.length - 1}
                            onClick={() => moveLogo(logo.id, 1)}
                            className="rounded border border-ink/15 px-2 py-0.5 text-xs disabled:opacity-30"
                            aria-label="Move down"
                          >
                            ↓
                          </button>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logo.src}
                          alt=""
                          className="h-10 w-24 object-contain object-left"
                        />
                        <input
                          className="min-w-[8rem] flex-1 rounded-lg border border-ink/15 bg-paper px-2 py-1.5 text-sm"
                          value={logo.name}
                          onChange={(e) =>
                            setContent((c) => ({
                              ...c,
                              logos: c.logos.map((l) =>
                                l.id === logo.id ? { ...l, name: e.target.value } : l,
                              ),
                            }))
                          }
                          onBlur={(e) => {
                            if (e.target.value.trim() !== logo.name) {
                              patchLogo(logo.id, { name: e.target.value.trim() })
                            }
                          }}
                        />
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => patchLogo(logo.id, { visible: logo.visible === false })}
                          className="rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs font-medium"
                        >
                          {logo.visible === false ? 'Show' : 'Hide'}
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => removeLogo(logo.id)}
                          className="rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs font-medium text-red-800 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {tab === 'site' && (
              <SectionSave
                busy={busy}
                onSave={() => saveContent(content)}
                title="Site & contact"
                note="Phone digits update WhatsApp, call, and text links automatically on the public site."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Business name"
                    value={content.site.name}
                    onChange={(v) => setContent({ ...content, site: { ...content.site, name: v } })}
                  />
                  <Field
                    label="Short name"
                    value={content.site.shortName}
                    onChange={(v) =>
                      setContent({ ...content, site: { ...content.site, shortName: v } })
                    }
                  />
                  <Field
                    label="Tagline"
                    value={content.site.tagline}
                    onChange={(v) =>
                      setContent({ ...content, site: { ...content.site, tagline: v } })
                    }
                  />
                  <Field
                    label="Location line"
                    value={content.site.location}
                    onChange={(v) =>
                      setContent({ ...content, site: { ...content.site, location: v } })
                    }
                  />
                  <Field
                    label="Email"
                    value={content.site.email}
                    onChange={(v) => setContent({ ...content, site: { ...content.site, email: v } })}
                  />
                  <Field
                    label="Phone (digits)"
                    value={content.site.phone}
                    onChange={(v) => setContent({ ...content, site: { ...content.site, phone: v } })}
                    hint="e.g. 8455515506"
                  />
                  <Field
                    label="Phone display"
                    value={content.site.phoneDisplay}
                    onChange={(v) =>
                      setContent({ ...content, site: { ...content.site, phoneDisplay: v } })
                    }
                  />
                  <Field
                    label="Nav button label"
                    value={content.site.navCta}
                    onChange={(v) =>
                      setContent({ ...content, site: { ...content.site, navCta: v } })
                    }
                  />
                </div>
                <Field
                  label="SEO description"
                  value={content.site.description}
                  onChange={(v) =>
                    setContent({ ...content, site: { ...content.site, description: v } })
                  }
                  multiline
                />
                <Field
                  label="Footer blurb"
                  value={content.site.footerBlurb}
                  onChange={(v) =>
                    setContent({ ...content, site: { ...content.site, footerBlurb: v } })
                  }
                  multiline
                />
                <Field
                  label="Footer meta line"
                  value={content.site.footerMeta}
                  onChange={(v) =>
                    setContent({ ...content, site: { ...content.site, footerMeta: v } })
                  }
                />
                <div className="space-y-3">
                  <p className="text-sm font-medium text-ink/70">Navigation labels</p>
                  {content.site.nav.map((item, i) => (
                    <div key={item.href} className="grid gap-2 sm:grid-cols-2">
                      <Field
                        label={`Link ${i + 1} label`}
                        value={item.label}
                        onChange={(v) => {
                          const nav = content.site.nav.map((n, j) =>
                            j === i ? { ...n, label: v } : n,
                          )
                          setContent({ ...content, site: { ...content.site, nav } })
                        }}
                      />
                      <Field
                        label={`Link ${i + 1} target`}
                        value={item.href}
                        onChange={(v) => {
                          const nav = content.site.nav.map((n, j) =>
                            j === i ? { ...n, href: v } : n,
                          )
                          setContent({ ...content, site: { ...content.site, nav } })
                        }}
                        hint="#work, #services, …"
                      />
                    </div>
                  ))}
                </div>
              </SectionSave>
            )}

            {tab === 'hero' && (
              <SectionSave busy={busy} onSave={() => saveContent(content)} title="Hero">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Opening name animation"
                    value={content.hero.openName}
                    onChange={(v) =>
                      setContent({ ...content, hero: { ...content.hero, openName: v } })
                    }
                  />
                  <Field
                    label="Eyebrow badge"
                    value={content.hero.eyebrow}
                    onChange={(v) =>
                      setContent({ ...content, hero: { ...content.hero, eyebrow: v } })
                    }
                  />
                  <Field
                    label="Headline"
                    value={content.hero.headline}
                    onChange={(v) =>
                      setContent({ ...content, hero: { ...content.hero, headline: v } })
                    }
                  />
                  <Field
                    label="Accent line"
                    value={content.hero.bodyAccent}
                    onChange={(v) =>
                      setContent({ ...content, hero: { ...content.hero, bodyAccent: v } })
                    }
                  />
                </div>
                <Field
                  label="Body"
                  value={content.hero.body}
                  onChange={(v) => setContent({ ...content, hero: { ...content.hero, body: v } })}
                  multiline
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Primary button"
                    value={content.hero.ctaPrimaryLabel}
                    onChange={(v) =>
                      setContent({ ...content, hero: { ...content.hero, ctaPrimaryLabel: v } })
                    }
                  />
                  <Field
                    label="Primary link"
                    value={content.hero.ctaPrimaryHref}
                    onChange={(v) =>
                      setContent({ ...content, hero: { ...content.hero, ctaPrimaryHref: v } })
                    }
                  />
                  <Field
                    label="Secondary button"
                    value={content.hero.ctaSecondaryLabel}
                    onChange={(v) =>
                      setContent({ ...content, hero: { ...content.hero, ctaSecondaryLabel: v } })
                    }
                  />
                  <Field
                    label="Secondary link"
                    value={content.hero.ctaSecondaryHref}
                    onChange={(v) =>
                      setContent({ ...content, hero: { ...content.hero, ctaSecondaryHref: v } })
                    }
                  />
                  <Field
                    label="Orbit caption"
                    value={content.hero.orbitCaption}
                    onChange={(v) =>
                      setContent({ ...content, hero: { ...content.hero, orbitCaption: v } })
                    }
                  />
                </div>
              </SectionSave>
            )}

            {tab === 'clients' && (
              <SectionSave busy={busy} onSave={() => saveContent(content)} title="Clients section">
                <Field
                  label="Eyebrow"
                  value={content.clients.eyebrow}
                  onChange={(v) =>
                    setContent({ ...content, clients: { ...content.clients, eyebrow: v } })
                  }
                />
                <Field
                  label="Title"
                  value={content.clients.title}
                  onChange={(v) =>
                    setContent({ ...content, clients: { ...content.clients, title: v } })
                  }
                />
                <Field
                  label="Subtitle"
                  value={content.clients.subtitle}
                  onChange={(v) =>
                    setContent({ ...content, clients: { ...content.clients, subtitle: v } })
                  }
                  multiline
                />
                <Field
                  label="Empty message"
                  value={content.clients.emptyMessage}
                  onChange={(v) =>
                    setContent({ ...content, clients: { ...content.clients, emptyMessage: v } })
                  }
                />
              </SectionSave>
            )}

            {tab === 'services' && (
              <SectionSave busy={busy} onSave={() => saveContent(content)} title="Services">
                <Field
                  label="Eyebrow"
                  value={content.services.eyebrow}
                  onChange={(v) =>
                    setContent({ ...content, services: { ...content.services, eyebrow: v } })
                  }
                />
                <Field
                  label="Title"
                  value={content.services.title}
                  onChange={(v) =>
                    setContent({ ...content, services: { ...content.services, title: v } })
                  }
                />
                <Field
                  label="Subtitle"
                  value={content.services.subtitle}
                  onChange={(v) =>
                    setContent({ ...content, services: { ...content.services, subtitle: v } })
                  }
                  multiline
                />
                {content.services.items.map((item, i) => (
                  <div key={item.id} className="rounded-xl border border-ink/10 bg-white p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-brass">
                      Card {item.num}
                    </p>
                    <Field
                      label="Title"
                      value={item.title}
                      onChange={(v) => {
                        const items = content.services.items.map((it, j) =>
                          j === i ? { ...it, title: v } : it,
                        )
                        setContent({ ...content, services: { ...content.services, items } })
                      }}
                    />
                    <Field
                      label="Description"
                      value={item.description}
                      onChange={(v) => {
                        const items = content.services.items.map((it, j) =>
                          j === i ? { ...it, description: v } : it,
                        )
                        setContent({ ...content, services: { ...content.services, items } })
                      }}
                      multiline
                    />
                    <Field
                      label="Bullet points (one per line)"
                      value={item.points.join('\n')}
                      onChange={(v) => {
                        const points = v.split('\n').map((s) => s.trim()).filter(Boolean)
                        const items = content.services.items.map((it, j) =>
                          j === i ? { ...it, points } : it,
                        )
                        setContent({ ...content, services: { ...content.services, items } })
                      }}
                      multiline
                    />
                  </div>
                ))}
              </SectionSave>
            )}

            {tab === 'spotlight' && (
              <SectionSave busy={busy} onSave={() => saveContent(content)} title="Spotlight">
                <Field
                  label="Eyebrow"
                  value={content.spotlight.eyebrow}
                  onChange={(v) =>
                    setContent({ ...content, spotlight: { ...content.spotlight, eyebrow: v } })
                  }
                />
                <Field
                  label="Big lines (one per line)"
                  value={content.spotlight.titleLines.join('\n')}
                  onChange={(v) =>
                    setContent({
                      ...content,
                      spotlight: {
                        ...content.spotlight,
                        titleLines: v.split('\n').map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  multiline
                />
                <Field
                  label="Body"
                  value={content.spotlight.body}
                  onChange={(v) =>
                    setContent({ ...content, spotlight: { ...content.spotlight, body: v } })
                  }
                  multiline
                />
                <Field
                  label="Accent"
                  value={content.spotlight.accent}
                  onChange={(v) =>
                    setContent({ ...content, spotlight: { ...content.spotlight, accent: v } })
                  }
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Primary button"
                    value={content.spotlight.ctaPrimaryLabel}
                    onChange={(v) =>
                      setContent({
                        ...content,
                        spotlight: { ...content.spotlight, ctaPrimaryLabel: v },
                      })
                    }
                  />
                  <Field
                    label="Primary link"
                    value={content.spotlight.ctaPrimaryHref}
                    onChange={(v) =>
                      setContent({
                        ...content,
                        spotlight: { ...content.spotlight, ctaPrimaryHref: v },
                      })
                    }
                  />
                  <Field
                    label="Secondary button"
                    value={content.spotlight.ctaSecondaryLabel}
                    onChange={(v) =>
                      setContent({
                        ...content,
                        spotlight: { ...content.spotlight, ctaSecondaryLabel: v },
                      })
                    }
                  />
                  <Field
                    label="Secondary link"
                    value={content.spotlight.ctaSecondaryHref}
                    onChange={(v) =>
                      setContent({
                        ...content,
                        spotlight: { ...content.spotlight, ctaSecondaryHref: v },
                      })
                    }
                  />
                </div>
              </SectionSave>
            )}

            {tab === 'process' && (
              <SectionSave busy={busy} onSave={() => saveContent(content)} title="Process">
                <Field
                  label="Eyebrow"
                  value={content.process.eyebrow}
                  onChange={(v) =>
                    setContent({ ...content, process: { ...content.process, eyebrow: v } })
                  }
                />
                <Field
                  label="Title"
                  value={content.process.title}
                  onChange={(v) =>
                    setContent({ ...content, process: { ...content.process, title: v } })
                  }
                />
                <Field
                  label="Subtitle"
                  value={content.process.subtitle}
                  onChange={(v) =>
                    setContent({ ...content, process: { ...content.process, subtitle: v } })
                  }
                  multiline
                />
                {content.process.steps.map((step, i) => (
                  <div key={step.id} className="rounded-xl border border-ink/10 bg-white p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-brass">
                      Step {step.num}
                    </p>
                    <Field
                      label="Title"
                      value={step.title}
                      onChange={(v) => {
                        const steps = content.process.steps.map((s, j) =>
                          j === i ? { ...s, title: v } : s,
                        )
                        setContent({ ...content, process: { ...content.process, steps } })
                      }}
                    />
                    <Field
                      label="Body"
                      value={step.body}
                      onChange={(v) => {
                        const steps = content.process.steps.map((s, j) =>
                          j === i ? { ...s, body: v } : s,
                        )
                        setContent({ ...content, process: { ...content.process, steps } })
                      }}
                      multiline
                    />
                  </div>
                ))}
              </SectionSave>
            )}

            {tab === 'about' && (
              <SectionSave busy={busy} onSave={() => saveContent(content)} title="About">
                <Field
                  label="Eyebrow ({shortName} becomes your short name)"
                  value={content.about.eyebrow}
                  onChange={(v) =>
                    setContent({ ...content, about: { ...content.about, eyebrow: v } })
                  }
                />
                <Field
                  label="Title"
                  value={content.about.title}
                  onChange={(v) =>
                    setContent({ ...content, about: { ...content.about, title: v } })
                  }
                />
                <Field
                  label="Body"
                  value={content.about.body}
                  onChange={(v) => setContent({ ...content, about: { ...content.about, body: v } })}
                  multiline
                />
                <Field
                  label="Accent"
                  value={content.about.accent}
                  onChange={(v) =>
                    setContent({ ...content, about: { ...content.about, accent: v } })
                  }
                />
                {content.about.principles.map((p, i) => (
                  <div key={p.id} className="rounded-xl border border-ink/10 bg-white p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-brass">
                      Principle {i + 1}
                    </p>
                    <Field
                      label="Title"
                      value={p.title}
                      onChange={(v) => {
                        const principles = content.about.principles.map((x, j) =>
                          j === i ? { ...x, title: v } : x,
                        )
                        setContent({ ...content, about: { ...content.about, principles } })
                      }}
                    />
                    <Field
                      label="Body"
                      value={p.body}
                      onChange={(v) => {
                        const principles = content.about.principles.map((x, j) =>
                          j === i ? { ...x, body: v } : x,
                        )
                        setContent({ ...content, about: { ...content.about, principles } })
                      }}
                      multiline
                    />
                  </div>
                ))}
              </SectionSave>
            )}

            {tab === 'contact' && (
              <SectionSave busy={busy} onSave={() => saveContent(content)} title="Contact page">
                <Field
                  label="Eyebrow"
                  value={content.contact.eyebrow}
                  onChange={(v) =>
                    setContent({ ...content, contact: { ...content.contact, eyebrow: v } })
                  }
                />
                <Field
                  label="Title"
                  value={content.contact.title}
                  onChange={(v) =>
                    setContent({ ...content, contact: { ...content.contact, title: v } })
                  }
                />
                <Field
                  label="Intro"
                  value={content.contact.intro}
                  onChange={(v) =>
                    setContent({ ...content, contact: { ...content.contact, intro: v } })
                  }
                  multiline
                />
                <Field
                  label="Form eyebrow"
                  value={content.contact.formEyebrow}
                  onChange={(v) =>
                    setContent({ ...content, contact: { ...content.contact, formEyebrow: v } })
                  }
                />
                <Field
                  label="Form note"
                  value={content.contact.formNote}
                  onChange={(v) =>
                    setContent({ ...content, contact: { ...content.contact, formNote: v } })
                  }
                />
                <Field
                  label="Success message"
                  value={content.contact.successMessage}
                  onChange={(v) =>
                    setContent({ ...content, contact: { ...content.contact, successMessage: v } })
                  }
                />
              </SectionSave>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function SectionSave({
  title,
  note,
  children,
  onSave,
  busy,
}: {
  title: string
  note?: string
  children: React.ReactNode
  onSave: () => void
  busy: boolean
}) {
  return (
    <div className="soft-panel max-w-3xl space-y-5 border border-ink/10 bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">{title}</h2>
          {note && <p className="mt-1 font-serif text-sm italic text-ink/60">{note}</p>}
        </div>
        <button type="button" disabled={busy} onClick={onSave} className="btn btn-primary text-sm">
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>
      {children}
      <button type="button" disabled={busy} onClick={onSave} className="btn btn-primary">
        {busy ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  )
}
