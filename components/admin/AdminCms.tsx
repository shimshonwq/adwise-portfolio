import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_CONTENT,
  DEFAULT_THEME,
  type CmsContent,
  type LogoItem,
  type ThemeColors,
} from '../../lib/content'
import {
  LOGO_ACCEPT_ATTR,
  LOGO_BEST_HEIGHT,
  LOGO_BEST_TIP,
  LOGO_BEST_WIDTH,
  LOGO_EXT_LABEL,
  LOGO_HELP,
  LOGO_MAX_BYTES,
  LOGO_MAX_HEIGHT,
  LOGO_MAX_WIDTH,
  LOGO_MIN_HEIGHT,
  LOGO_MIN_WIDTH,
  logoMimeOk,
} from '../../lib/logo-rules'

type Phase = 'checking' | 'login' | 'app'
type Tab =
  | 'start'
  | 'logos'
  | 'colors'
  | 'site'
  | 'hero'
  | 'clients'
  | 'services'
  | 'spotlight'
  | 'process'
  | 'about'
  | 'contact'
  | 'pages'
  | 'security'

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'start', label: 'How this works', emoji: '1' },
  { id: 'logos', label: 'Logos', emoji: '2' },
  { id: 'colors', label: 'Colors', emoji: '3' },
  { id: 'site', label: 'Site & contact', emoji: '4' },
  { id: 'hero', label: 'Hero', emoji: '5' },
  { id: 'clients', label: 'Clients section', emoji: '6' },
  { id: 'services', label: 'Services', emoji: '7' },
  { id: 'spotlight', label: 'Spotlight', emoji: '8' },
  { id: 'process', label: 'Process', emoji: '9' },
  { id: 'about', label: 'About', emoji: '10' },
  { id: 'contact', label: 'Contact form', emoji: '11' },
  { id: 'pages', label: 'Other pages', emoji: '12' },
  { id: 'security', label: 'Password', emoji: '13' },
]

function Guide({
  title,
  what,
  how,
  happens,
  tip,
}: {
  title: string
  what: string
  how: string
  happens: string
  tip?: string
}) {
  return (
    <div className="mb-6 rounded-xl border border-brass/30 bg-paper-deep/40 p-5 text-sm leading-relaxed text-ink/80">
      <p className="font-display text-base font-bold text-ink">{title}</p>
      <p className="mt-3">
        <span className="font-semibold text-ink">What you change: </span>
        {what}
      </p>
      <p className="mt-2 whitespace-pre-line">
        <span className="font-semibold text-ink">How to change it: </span>
        {how}
      </p>
      <p className="mt-2">
        <span className="font-semibold text-ink">What happens when you save: </span>
        {happens}
      </p>
      {tip && (
        <p className="mt-2 rounded-lg bg-white/70 px-3 py-2 text-ink/70">
          <span className="font-semibold text-ink">Tip: </span>
          {tip}
        </p>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  multiline,
  hint,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  hint?: string
  type?: string
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
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
      {hint && <span className="mt-1 block text-xs text-ink/45">{hint}</span>}
    </label>
  )
}

function ColorField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-3">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-12 cursor-pointer rounded-lg border border-ink/15 bg-transparent p-0"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-ink/50">{hint}</span>}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded border border-ink/10 bg-paper px-2 py-1 font-mono text-xs"
        />
      </span>
    </label>
  )
}

function sortedLogos(logos: LogoItem[]) {
  return [...logos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

async function measureImage(file: File): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file)
  try {
    const dims = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = () => reject(new Error('Could not read image size'))
      img.src = url
    })
    return dims
  } finally {
    URL.revokeObjectURL(url)
  }
}

function validateLogoFile(file: File, width: number, height: number): string | null {
  if (!logoMimeOk(file.type)) {
    return `Wrong file type. Use ${LOGO_EXT_LABEL} only (not SVG, PDF, or HEIC).`
  }
  if (file.size > LOGO_MAX_BYTES) {
    return 'File is too big. Max size is 2 MB.'
  }
  if (width < LOGO_MIN_WIDTH || width > LOGO_MAX_WIDTH) {
    return `Width must be ${LOGO_MIN_WIDTH}–${LOGO_MAX_WIDTH}px (yours is ${width}px). Best: ${LOGO_BEST_WIDTH}.`
  }
  if (height < LOGO_MIN_HEIGHT || height > LOGO_MAX_HEIGHT) {
    return `Height must be ${LOGO_MIN_HEIGHT}–${LOGO_MAX_HEIGHT}px (yours is ${height}px). Best: ${LOGO_BEST_HEIGHT}.`
  }
  return null
}

export default function AdminCms() {
  const [phase, setPhase] = useState<Phase>('checking')
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState<Tab>('start')
  const [content, setContent] = useState<CmsContent>(DEFAULT_CONTENT)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadName, setUploadName] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<{ width: number; height: number } | null>(null)
  const [storageMode, setStorageMode] = useState<'github' | 'local' | 'kv' | 'unknown'>('unknown')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const logos = useMemo(() => sortedLogos(content.logos || []), [content.logos])
  const theme = content.theme || DEFAULT_THEME

  const flash = (ok: string) => {
    setMessage(ok)
    setError(null)
  }

  const applyApiResult = (data: { content?: CmsContent; publishMessage?: string }) => {
    if (data.content) setContent({ ...DEFAULT_CONTENT, ...data.content, theme: { ...DEFAULT_THEME, ...data.content.theme } })
    flash(
      data.publishMessage ||
        (storageMode === 'github'
          ? 'Saved to GitHub — Cloudflare will rebuild in about 1–3 minutes.'
          : 'Saved.'),
    )
  }

  const loadContent = useCallback(async () => {
    const res = await fetch('/api/admin/content/', { credentials: 'include' })
    if (!res.ok) throw new Error('Session expired — log in again')
    const data = await res.json()
    const next = data.content || DEFAULT_CONTENT
    setContent({
      ...DEFAULT_CONTENT,
      ...next,
      site: { ...DEFAULT_CONTENT.site, ...next.site },
      theme: { ...DEFAULT_THEME, ...next.theme },
      contact: { ...DEFAULT_CONTENT.contact, ...next.contact },
      projectsPage: { ...DEFAULT_CONTENT.projectsPage, ...next.projectsPage },
      notFoundPage: { ...DEFAULT_CONTENT.notFoundPage, ...next.notFoundPage },
    })
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
          try {
            const st = await fetch('/api/admin/status/', { credentials: 'include' })
            if (st.ok) {
              const status = await st.json()
              if (status.storage === 'github' || status.storage === 'local' || status.storage === 'kv') {
                setStorageMode(status.storage)
              }
            }
          } catch {
            /* ignore */
          }
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
      setTab('start')
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

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/password/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not change password')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      flash(data.message || 'Password updated.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change password')
    } finally {
      setBusy(false)
    }
  }

  const saveContent = async (next: CmsContent) => {
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
      applyApiResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const setTheme = (patch: Partial<ThemeColors>) => {
    setContent({ ...content, theme: { ...theme, ...patch } })
  }

  const moveLogo = async (id: string, dir: -1 | 1) => {
    const ids = logos.map((l) => l.id)
    const i = ids.indexOf(id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= ids.length) return
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
      applyApiResult(data)
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
      applyApiResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  const removeLogo = async (id: string) => {
    if (!confirm('Remove this logo from the website?')) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/logos/${encodeURIComponent(id)}/`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Remove failed')
      applyApiResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Remove failed')
    } finally {
      setBusy(false)
    }
  }

  const onPickFile = async (file: File | null) => {
    setUploadFile(file)
    setUploadPreview(null)
    setError(null)
    if (!file) return
    try {
      const dims = await measureImage(file)
      setUploadPreview(dims)
      const err = validateLogoFile(file, dims.width, dims.height)
      if (err) setError(err)
    } catch {
      setError('Could not read that image. Try a PNG, JPG, or WebP.')
      setUploadFile(null)
    }
  }

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) {
      setError('Choose a logo file first.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const dims = uploadPreview || (await measureImage(uploadFile))
      const err = validateLogoFile(uploadFile, dims.width, dims.height)
      if (err) throw new Error(err)
      const dataUrl = await readFileAsDataUrl(uploadFile)
      const res = await fetch('/api/admin/logos/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: uploadName.trim() || uploadFile.name.replace(/\.[^.]+$/, ''),
          dataUrl,
          width: dims.width,
          height: dims.height,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      applyApiResult(data)
      setUploadName('')
      setUploadFile(null)
      setUploadPreview(null)
      if (fileRef.current) fileRef.current.value = ''
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
              Edit your whole website
            </h1>
            <p className="mt-2 max-w-2xl font-serif text-base italic text-ink/70">
              Change logos, colors, words, buttons, and contact info. Saves go to GitHub — Cloudflare
              rebuilds in about 1–3 minutes. This page is private (only at /login).
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

        {message && (
          <p className="mb-4 rounded-lg border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {message}
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-lg border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        {phase === 'checking' && (
          <p className="font-serif italic text-ink/55">Checking session…</p>
        )}

        {phase === 'login' && (
          <form
            onSubmit={onLogin}
            className="soft-panel mx-auto max-w-md space-y-5 border border-ink/10 bg-white p-7 md:p-9"
          >
            <Guide
              title="Log in to edit the website"
              what="Your secret password unlocks the editor."
              how="Type your password in the box, then press Log in."
              happens="You stay signed in on this browser until you log out or change your password."
              tip="After you log in the first time, open the Password tab and pick a password only you know."
            />
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
            </label>
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
                    setError(null)
                    setMessage(null)
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    tab === t.id
                      ? 'bg-ink text-white'
                      : 'border border-ink/10 bg-white text-ink/70 hover:border-ink/25'
                  }`}
                >
                  <span className="mr-1.5 text-xs opacity-50">{t.emoji}.</span>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'start' && (
              <div className="soft-panel max-w-3xl space-y-4 border border-ink/10 bg-white p-6 md:p-8">
                <h2 className="font-display text-2xl font-bold">How this works (read me first)</h2>
                <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-ink/80">
                  <li>
                    Pick a tab at the top (Logos, Colors, Hero, and so on).
                  </li>
                  <li>
                    Read the yellow box — it tells you <strong>what</strong> you change,{' '}
                    <strong>how</strong>, and <strong>what happens</strong> after save.
                  </li>
                  <li>
                    Change the words / colors / logos. Press <strong>Save changes</strong>.
                  </li>
                  <li>
                    Wait 1–3 minutes, then refresh the public site. Your visitors see the update.
                  </li>
                </ol>
                <div className="rounded-xl border border-ink/10 bg-paper p-4 text-sm">
                  <p className="font-semibold">Easy path for most edits</p>
                  <p className="mt-2 text-ink/70">
                    Logos → add client logos · Colors → paint the whole site · Site & contact → phone,
                    email, menu · Hero → big headline on top · Contact form → form labels · Password →
                    keep the editor safe.
                  </p>
                </div>
              </div>
            )}

            {tab === 'logos' && (
              <div className="max-w-3xl space-y-6">
                <Guide
                  title={LOGO_HELP.title}
                  what={LOGO_HELP.what}
                  how={LOGO_HELP.how}
                  happens={LOGO_HELP.happens}
                  tip={LOGO_HELP.rules}
                />

                <form
                  onSubmit={onUpload}
                  className="soft-panel space-y-4 border border-ink/10 bg-white p-6"
                >
                  <h2 className="font-display text-xl font-bold">Add a logo</h2>
                  <div className="rounded-lg border border-dashed border-brass/40 bg-paper-deep/30 p-4 text-sm text-ink/75">
                    <p className="font-semibold text-ink">Required file rules</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>
                        Type: <strong>{LOGO_EXT_LABEL}</strong> only
                      </li>
                      <li>
                        Best size: <strong>{LOGO_BEST_WIDTH}</strong>,{' '}
                        <strong>{LOGO_BEST_HEIGHT}</strong>
                      </li>
                      <li>
                        Allowed size: width {LOGO_MIN_WIDTH}–{LOGO_MAX_WIDTH}px · height{' '}
                        {LOGO_MIN_HEIGHT}–{LOGO_MAX_HEIGHT}px
                      </li>
                      <li>Max file size: <strong>2 MB</strong></li>
                      <li>{LOGO_BEST_TIP}</li>
                    </ul>
                  </div>
                  <Field
                    label="Company name"
                    value={uploadName}
                    onChange={setUploadName}
                    hint="Shown if the picture fails to load. Example: Coffee Break"
                  />
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-medium text-ink/70">
                      Logo file ({LOGO_EXT_LABEL})
                    </span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept={LOGO_ACCEPT_ATTR}
                      onChange={(e) => onPickFile(e.target.files?.[0] || null)}
                      className="w-full text-sm"
                    />
                    {uploadPreview && (
                      <span className="mt-1 block text-xs text-ink/55">
                        Selected size: {uploadPreview.width}×{uploadPreview.height}px
                        {uploadFile ? ` · ${(uploadFile.size / 1024).toFixed(0)} KB` : ''}
                      </span>
                    )}
                  </label>
                  <button type="submit" disabled={busy || !uploadFile} className="btn btn-primary">
                    {busy ? 'Uploading…' : 'Add logo'}
                  </button>
                </form>

                <div className="soft-panel space-y-3 border border-ink/10 bg-white p-6">
                  <h2 className="font-display text-xl font-bold">Your logos (order = left to right)</h2>
                  <p className="text-sm text-ink/60">
                    Use ↑ ↓ to change order. Hide removes it from the public bar without deleting.
                  </p>
                  {logos.map((logo, i) => (
                    <div
                      key={logo.id}
                      className="flex flex-wrap items-center gap-3 rounded-xl border border-ink/10 p-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="h-12 w-24 object-contain bg-white"
                      />
                      <input
                        className="min-w-[8rem] flex-1 rounded border border-ink/15 px-2 py-1.5 text-sm"
                        value={logo.name}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            logos: content.logos.map((l) =>
                              l.id === logo.id ? { ...l, name: e.target.value } : l,
                            ),
                          })
                        }
                        onBlur={(e) => patchLogo(logo.id, { name: e.target.value })}
                      />
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          disabled={busy || i === 0}
                          onClick={() => moveLogo(logo.id, -1)}
                          className="btn btn-secondary !px-2 !py-1 text-xs"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={busy || i === logos.length - 1}
                          onClick={() => moveLogo(logo.id, 1)}
                          className="btn btn-secondary !px-2 !py-1 text-xs"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => patchLogo(logo.id, { visible: logo.visible === false })}
                          className="btn btn-secondary !px-2 !py-1 text-xs"
                        >
                          {logo.visible === false ? 'Show' : 'Hide'}
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => removeLogo(logo.id)}
                          className="btn btn-secondary !px-2 !py-1 text-xs text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'colors' && (
              <div className="max-w-3xl">
                <Guide
                  title="Change the website colors"
                  what="These colors paint almost the whole site — background paper, gold buttons, dark text, and accents."
                  how="Click a color square to pick, or type a hex code like #fdc621. Then press Save colors."
                  happens="Visitors see the new palette after Cloudflare rebuilds (about 1–3 minutes)."
                  tip="Keep gold for brand and dark ink for text so the site stays readable. Reset restores the original Adwise look."
                />
                <SectionSave
                  busy={busy}
                  onSave={() => saveContent(content)}
                  title="Brand colors"
                  note="These map to the site’s CSS theme variables."
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ColorField
                      label="Ink (main text)"
                      value={theme.ink}
                      onChange={(v) => setTheme({ ink: v })}
                      hint="Headlines and body text"
                    />
                    <ColorField
                      label="Ink soft"
                      value={theme.inkSoft}
                      onChange={(v) => setTheme({ inkSoft: v })}
                      hint="Slightly lighter dark areas"
                    />
                    <ColorField
                      label="Paper (page background)"
                      value={theme.paper}
                      onChange={(v) => setTheme({ paper: v })}
                      hint="Main page background"
                    />
                    <ColorField
                      label="Paper deep"
                      value={theme.paperDeep}
                      onChange={(v) => setTheme({ paperDeep: v })}
                      hint="Panels and soft blocks"
                    />
                    <ColorField
                      label="Brand gold"
                      value={theme.brand}
                      onChange={(v) => setTheme({ brand: v })}
                      hint="Buttons, highlights, accents"
                    />
                    <ColorField
                      label="Brand deep"
                      value={theme.brandDeep}
                      onChange={(v) => setTheme({ brandDeep: v })}
                      hint="Hover / darker gold"
                    />
                    <ColorField
                      label="Brass"
                      value={theme.brass}
                      onChange={(v) => setTheme({ brass: v })}
                      hint="Small labels / eyebrows"
                    />
                    <ColorField
                      label="Muted"
                      value={theme.muted}
                      onChange={(v) => setTheme({ muted: v })}
                      hint="Quiet secondary text"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary text-sm"
                    onClick={() => setContent({ ...content, theme: { ...DEFAULT_THEME } })}
                  >
                    Reset to original Adwise colors
                  </button>
                </SectionSave>
              </div>
            )}

            {tab === 'site' && (
              <div className="max-w-3xl">
                <Guide
                  title="Business name, contact, and menu"
                  what="Your company name, phone, email, website address, menu links, and footer text."
                  how="Edit any box. Menu links use #work style anchors for homepage sections."
                  happens="Saved to GitHub; the live site updates after rebuild."
                />
                <SectionSave busy={busy} onSave={() => saveContent(content)} title="Site & contact">
                  <Field label="Business name" value={content.site.name} onChange={(v) => setContent({ ...content, site: { ...content.site, name: v } })} />
                  <Field label="Short name" value={content.site.shortName} onChange={(v) => setContent({ ...content, site: { ...content.site, shortName: v } })} hint="Used in About eyebrow like “About Adwise”" />
                  <Field label="Tagline" value={content.site.tagline} onChange={(v) => setContent({ ...content, site: { ...content.site, tagline: v } })} />
                  <Field label="Website URL" value={content.site.url} onChange={(v) => setContent({ ...content, site: { ...content.site, url: v } })} hint="Example: https://adwisemedia.co" />
                  <Field label="SEO description" value={content.site.description} onChange={(v) => setContent({ ...content, site: { ...content.site, description: v } })} multiline hint="Shown in Google search results" />
                  <Field label="SEO title ending" value={content.site.seoTitleSuffix || ''} onChange={(v) => setContent({ ...content, site: { ...content.site, seoTitleSuffix: v } })} hint="Browser tab: Name — this text" />
                  <Field label="SEO keywords" value={content.site.seoKeywords || ''} onChange={(v) => setContent({ ...content, site: { ...content.site, seoKeywords: v } })} hint="Comma-separated words" />
                  <Field label="Email" value={content.site.email} onChange={(v) => setContent({ ...content, site: { ...content.site, email: v } })} />
                  <Field label="Phone (digits for WhatsApp/call)" value={content.site.phone} onChange={(v) => setContent({ ...content, site: { ...content.site, phone: v } })} hint="Example: 8455515506" />
                  <Field label="Phone display" value={content.site.phoneDisplay} onChange={(v) => setContent({ ...content, site: { ...content.site, phoneDisplay: v } })} hint="Example: (845) 551-5506" />
                  <Field label="Location line" value={content.site.location} onChange={(v) => setContent({ ...content, site: { ...content.site, location: v } })} />
                  <Field label="Menu button text" value={content.site.navCta} onChange={(v) => setContent({ ...content, site: { ...content.site, navCta: v } })} />
                  <Field label="Menu button link" value={content.site.navCtaHref || '/#contact'} onChange={(v) => setContent({ ...content, site: { ...content.site, navCtaHref: v } })} />
                  <Field label="Footer blurb" value={content.site.footerBlurb} onChange={(v) => setContent({ ...content, site: { ...content.site, footerBlurb: v } })} multiline />
                  <Field label="Footer meta line" value={content.site.footerMeta} onChange={(v) => setContent({ ...content, site: { ...content.site, footerMeta: v } })} />
                  <Field label="Footer “Explore” heading" value={content.site.footerExploreHeading || 'Explore'} onChange={(v) => setContent({ ...content, site: { ...content.site, footerExploreHeading: v } })} />
                  <Field label="Footer “Contact” heading" value={content.site.footerContactHeading || 'Contact'} onChange={(v) => setContent({ ...content, site: { ...content.site, footerContactHeading: v } })} />
                  {content.site.nav.map((item, i) => (
                    <div key={i} className="grid gap-3 rounded-xl border border-ink/10 p-3 sm:grid-cols-2">
                      <Field label={`Menu item ${i + 1} label`} value={item.label} onChange={(v) => {
                        const nav = content.site.nav.map((n, j) => (j === i ? { ...n, label: v } : n))
                        setContent({ ...content, site: { ...content.site, nav } })
                      }} />
                      <Field label="Link" value={item.href} onChange={(v) => {
                        const nav = content.site.nav.map((n, j) => (j === i ? { ...n, href: v } : n))
                        setContent({ ...content, site: { ...content.site, nav } })
                      }} hint="Example: #services" />
                    </div>
                  ))}
                </SectionSave>
              </div>
            )}

            {tab === 'hero' && (
              <div className="max-w-3xl">
                <Guide
                  title="Top of the homepage (Hero)"
                  what="The big first screen: badge, headline, paragraph, buttons, and opening animation name."
                  how="Edit the boxes. Links can be #work or #contact."
                  happens="Homepage hero updates after the rebuild."
                />
                <SectionSave busy={busy} onSave={() => saveContent(content)} title="Hero">
                  <Field label="Opening name (big letters)" value={content.hero.openName} onChange={(v) => setContent({ ...content, hero: { ...content.hero, openName: v } })} />
                  <Field label="Eyebrow / badge" value={content.hero.eyebrow} onChange={(v) => setContent({ ...content, hero: { ...content.hero, eyebrow: v } })} />
                  <Field label="Headline" value={content.hero.headline} onChange={(v) => setContent({ ...content, hero: { ...content.hero, headline: v } })} />
                  <Field label="Body" value={content.hero.body} onChange={(v) => setContent({ ...content, hero: { ...content.hero, body: v } })} multiline />
                  <Field label="Body accent (italic gold line)" value={content.hero.bodyAccent} onChange={(v) => setContent({ ...content, hero: { ...content.hero, bodyAccent: v } })} />
                  <Field label="Primary button text" value={content.hero.ctaPrimaryLabel} onChange={(v) => setContent({ ...content, hero: { ...content.hero, ctaPrimaryLabel: v } })} />
                  <Field label="Primary button link" value={content.hero.ctaPrimaryHref} onChange={(v) => setContent({ ...content, hero: { ...content.hero, ctaPrimaryHref: v } })} />
                  <Field label="Secondary button text" value={content.hero.ctaSecondaryLabel} onChange={(v) => setContent({ ...content, hero: { ...content.hero, ctaSecondaryLabel: v } })} />
                  <Field label="Secondary button link" value={content.hero.ctaSecondaryHref} onChange={(v) => setContent({ ...content, hero: { ...content.hero, ctaSecondaryHref: v } })} />
                  <Field label="Orbit caption" value={content.hero.orbitCaption} onChange={(v) => setContent({ ...content, hero: { ...content.hero, orbitCaption: v } })} />
                </SectionSave>
              </div>
            )}

            {tab === 'clients' && (
              <div className="max-w-3xl">
                <Guide
                  title="Clients section words"
                  what="The titles above the sliding logo bar (not the logos themselves — those are under Logos)."
                  how="Edit eyebrow, title, subtitle, and the empty message."
                  happens="Section text updates after rebuild."
                />
                <SectionSave busy={busy} onSave={() => saveContent(content)} title="Clients section">
                  <Field label="Eyebrow" value={content.clients.eyebrow} onChange={(v) => setContent({ ...content, clients: { ...content.clients, eyebrow: v } })} />
                  <Field label="Title" value={content.clients.title} onChange={(v) => setContent({ ...content, clients: { ...content.clients, title: v } })} />
                  <Field label="Subtitle" value={content.clients.subtitle} onChange={(v) => setContent({ ...content, clients: { ...content.clients, subtitle: v } })} multiline />
                  <Field label="Empty message (if no logos)" value={content.clients.emptyMessage} onChange={(v) => setContent({ ...content, clients: { ...content.clients, emptyMessage: v } })} />
                </SectionSave>
              </div>
            )}

            {tab === 'services' && (
              <div className="max-w-3xl">
                <Guide
                  title="Services cards"
                  what="The “What we do” section: titles, descriptions, bullet points, and card colors."
                  how="Edit each card. Points = one idea per line. Tone = white, ink, or gold background."
                  happens="Service cards update after rebuild."
                  tip="You can add or remove a card with the buttons under each card."
                />
                <SectionSave busy={busy} onSave={() => saveContent(content)} title="Services">
                  <Field label="Eyebrow" value={content.services.eyebrow} onChange={(v) => setContent({ ...content, services: { ...content.services, eyebrow: v } })} />
                  <Field label="Title" value={content.services.title} onChange={(v) => setContent({ ...content, services: { ...content.services, title: v } })} />
                  <Field label="Subtitle" value={content.services.subtitle} onChange={(v) => setContent({ ...content, services: { ...content.services, subtitle: v } })} multiline />
                  {content.services.items.map((item, i) => (
                    <div key={item.id} className="space-y-3 rounded-xl border border-ink/10 bg-paper/50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-brass">Card {i + 1}</p>
                      <Field label="Number label" value={item.num} onChange={(v) => {
                        const items = content.services.items.map((x, j) => (j === i ? { ...x, num: v } : x))
                        setContent({ ...content, services: { ...content.services, items } })
                      }} />
                      <Field label="Title" value={item.title} onChange={(v) => {
                        const items = content.services.items.map((x, j) => (j === i ? { ...x, title: v } : x))
                        setContent({ ...content, services: { ...content.services, items } })
                      }} />
                      <Field label="Description" value={item.description} multiline onChange={(v) => {
                        const items = content.services.items.map((x, j) => (j === i ? { ...x, description: v } : x))
                        setContent({ ...content, services: { ...content.services, items } })
                      }} />
                      <Field label="Bullet points (one per line)" value={item.points.join('\n')} multiline onChange={(v) => {
                        const items = content.services.items.map((x, j) =>
                          j === i ? { ...x, points: v.split('\n').map((s) => s.trim()).filter(Boolean) } : x,
                        )
                        setContent({ ...content, services: { ...content.services, items } })
                      }} />
                      <label className="block text-sm">
                        <span className="mb-1.5 block font-medium text-ink/70">Card color tone</span>
                        <select
                          className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm"
                          value={item.tone}
                          onChange={(e) => {
                            const tone = e.target.value as 'white' | 'ink' | 'gold'
                            const items = content.services.items.map((x, j) => (j === i ? { ...x, tone } : x))
                            setContent({ ...content, services: { ...content.services, items } })
                          }}
                        >
                          <option value="white">White</option>
                          <option value="ink">Ink (dark)</option>
                          <option value="gold">Gold</option>
                        </select>
                      </label>
                      <button
                        type="button"
                        className="btn btn-secondary text-xs"
                        onClick={() => {
                          const items = content.services.items.filter((_, j) => j !== i)
                          setContent({ ...content, services: { ...content.services, items } })
                        }}
                      >
                        Remove this card
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary text-sm"
                    onClick={() => {
                      const n = content.services.items.length + 1
                      setContent({
                        ...content,
                        services: {
                          ...content.services,
                          items: [
                            ...content.services.items,
                            {
                              id: `service-${Date.now().toString(36)}`,
                              num: String(n).padStart(2, '0'),
                              title: 'New service',
                              description: 'Describe this service.',
                              points: ['Point one', 'Point two'],
                              tone: 'white',
                            },
                          ],
                        },
                      })
                    }}
                  >
                    + Add another service card
                  </button>
                </SectionSave>
              </div>
            )}

            {tab === 'spotlight' && (
              <div className="max-w-3xl">
                <Guide
                  title="Spotlight / manifesto block"
                  what="The bold dark section with stacked title lines and two buttons."
                  how="Title lines = one word/line per row in the box."
                  happens="Spotlight section updates after rebuild."
                />
                <SectionSave busy={busy} onSave={() => saveContent(content)} title="Spotlight">
                  <Field label="Eyebrow" value={content.spotlight.eyebrow} onChange={(v) => setContent({ ...content, spotlight: { ...content.spotlight, eyebrow: v } })} />
                  <Field label="Title lines (one per line)" value={content.spotlight.titleLines.join('\n')} multiline onChange={(v) => setContent({ ...content, spotlight: { ...content.spotlight, titleLines: v.split('\n').map((s) => s.trim()).filter(Boolean) } })} />
                  <Field label="Body" value={content.spotlight.body} multiline onChange={(v) => setContent({ ...content, spotlight: { ...content.spotlight, body: v } })} />
                  <Field label="Accent line" value={content.spotlight.accent} onChange={(v) => setContent({ ...content, spotlight: { ...content.spotlight, accent: v } })} />
                  <Field label="Primary button text" value={content.spotlight.ctaPrimaryLabel} onChange={(v) => setContent({ ...content, spotlight: { ...content.spotlight, ctaPrimaryLabel: v } })} />
                  <Field label="Primary button link" value={content.spotlight.ctaPrimaryHref} onChange={(v) => setContent({ ...content, spotlight: { ...content.spotlight, ctaPrimaryHref: v } })} />
                  <Field label="Secondary button text" value={content.spotlight.ctaSecondaryLabel} onChange={(v) => setContent({ ...content, spotlight: { ...content.spotlight, ctaSecondaryLabel: v } })} />
                  <Field label="Secondary button link" value={content.spotlight.ctaSecondaryHref} onChange={(v) => setContent({ ...content, spotlight: { ...content.spotlight, ctaSecondaryHref: v } })} />
                </SectionSave>
              </div>
            )}

            {tab === 'process' && (
              <div className="max-w-3xl">
                <Guide
                  title="Process steps"
                  what="Research → Create → Launch style steps."
                  how="Edit each step’s number, title, body, and color tone. Add or remove steps as needed."
                  happens="Process section updates after rebuild."
                />
                <SectionSave busy={busy} onSave={() => saveContent(content)} title="Process">
                  <Field label="Eyebrow" value={content.process.eyebrow} onChange={(v) => setContent({ ...content, process: { ...content.process, eyebrow: v } })} />
                  <Field label="Title" value={content.process.title} onChange={(v) => setContent({ ...content, process: { ...content.process, title: v } })} />
                  <Field label="Subtitle" value={content.process.subtitle} multiline onChange={(v) => setContent({ ...content, process: { ...content.process, subtitle: v } })} />
                  {content.process.steps.map((step, i) => (
                    <div key={step.id} className="space-y-3 rounded-xl border border-ink/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-brass">Step {i + 1}</p>
                      <Field label="Number" value={step.num} onChange={(v) => {
                        const steps = content.process.steps.map((x, j) => (j === i ? { ...x, num: v } : x))
                        setContent({ ...content, process: { ...content.process, steps } })
                      }} />
                      <Field label="Title" value={step.title} onChange={(v) => {
                        const steps = content.process.steps.map((x, j) => (j === i ? { ...x, title: v } : x))
                        setContent({ ...content, process: { ...content.process, steps } })
                      }} />
                      <Field label="Body" value={step.body} multiline onChange={(v) => {
                        const steps = content.process.steps.map((x, j) => (j === i ? { ...x, body: v } : x))
                        setContent({ ...content, process: { ...content.process, steps } })
                      }} />
                      <label className="block text-sm">
                        <span className="mb-1.5 block font-medium text-ink/70">Tone</span>
                        <select
                          className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm"
                          value={step.tone}
                          onChange={(e) => {
                            const tone = e.target.value as 'white' | 'gold' | 'ink'
                            const steps = content.process.steps.map((x, j) => (j === i ? { ...x, tone } : x))
                            setContent({ ...content, process: { ...content.process, steps } })
                          }}
                        >
                          <option value="white">White</option>
                          <option value="gold">Gold</option>
                          <option value="ink">Ink</option>
                        </select>
                      </label>
                      <button
                        type="button"
                        className="btn btn-secondary text-xs"
                        onClick={() => {
                          const steps = content.process.steps.filter((_, j) => j !== i)
                          setContent({ ...content, process: { ...content.process, steps } })
                        }}
                      >
                        Remove step
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary text-sm"
                    onClick={() => {
                      const n = content.process.steps.length + 1
                      setContent({
                        ...content,
                        process: {
                          ...content.process,
                          steps: [
                            ...content.process.steps,
                            {
                              id: `step-${Date.now().toString(36)}`,
                              num: String(n).padStart(2, '0'),
                              title: 'New step',
                              body: 'Describe this step.',
                              tone: 'white',
                            },
                          ],
                        },
                      })
                    }}
                  >
                    + Add step
                  </button>
                </SectionSave>
              </div>
            )}

            {tab === 'about' && (
              <div className="max-w-3xl">
                <Guide
                  title="About section"
                  what="About headline, story, accent line, and principle cards."
                  how="Use {shortName} in the eyebrow to insert your short business name automatically."
                  happens="About section updates after rebuild."
                />
                <SectionSave busy={busy} onSave={() => saveContent(content)} title="About">
                  <Field label="Eyebrow" value={content.about.eyebrow} onChange={(v) => setContent({ ...content, about: { ...content.about, eyebrow: v } })} hint="Tip: write About {shortName}" />
                  <Field label="Title" value={content.about.title} onChange={(v) => setContent({ ...content, about: { ...content.about, title: v } })} />
                  <Field label="Body" value={content.about.body} multiline onChange={(v) => setContent({ ...content, about: { ...content.about, body: v } })} />
                  <Field label="Accent" value={content.about.accent} onChange={(v) => setContent({ ...content, about: { ...content.about, accent: v } })} />
                  {content.about.principles.map((p, i) => (
                    <div key={p.id} className="space-y-3 rounded-xl border border-ink/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-brass">Principle {i + 1}</p>
                      <Field label="Title" value={p.title} onChange={(v) => {
                        const principles = content.about.principles.map((x, j) => (j === i ? { ...x, title: v } : x))
                        setContent({ ...content, about: { ...content.about, principles } })
                      }} />
                      <Field label="Body" value={p.body} multiline onChange={(v) => {
                        const principles = content.about.principles.map((x, j) => (j === i ? { ...x, body: v } : x))
                        setContent({ ...content, about: { ...content.about, principles } })
                      }} />
                      <label className="block text-sm">
                        <span className="mb-1.5 block font-medium text-ink/70">Tone</span>
                        <select
                          className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm"
                          value={p.tone}
                          onChange={(e) => {
                            const tone = e.target.value as 'ink' | 'gold' | 'paper'
                            const principles = content.about.principles.map((x, j) => (j === i ? { ...x, tone } : x))
                            setContent({ ...content, about: { ...content.about, principles } })
                          }}
                        >
                          <option value="ink">Ink</option>
                          <option value="gold">Gold</option>
                          <option value="paper">Paper</option>
                        </select>
                      </label>
                      <button
                        type="button"
                        className="btn btn-secondary text-xs"
                        onClick={() => {
                          const principles = content.about.principles.filter((_, j) => j !== i)
                          setContent({ ...content, about: { ...content.about, principles } })
                        }}
                      >
                        Remove principle
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary text-sm"
                    onClick={() =>
                      setContent({
                        ...content,
                        about: {
                          ...content.about,
                          principles: [
                            ...content.about.principles,
                            {
                              id: `principle-${Date.now().toString(36)}`,
                              title: 'New principle',
                              body: 'Describe it.',
                              tone: 'paper',
                            },
                          ],
                        },
                      })
                    }
                  >
                    + Add principle
                  </button>
                </SectionSave>
              </div>
            )}

            {tab === 'contact' && (
              <div className="max-w-3xl">
                <Guide
                  title="Contact page & form"
                  what="Headings, intro, and every form label / placeholder / button / success message."
                  how="Change the words visitors see when they fill out the form."
                  happens="Contact section updates after rebuild. Form still emails your site email via FormSubmit."
                />
                <SectionSave busy={busy} onSave={() => saveContent(content)} title="Contact">
                  <Field label="Eyebrow" value={content.contact.eyebrow} onChange={(v) => setContent({ ...content, contact: { ...content.contact, eyebrow: v } })} />
                  <Field label="Title" value={content.contact.title} onChange={(v) => setContent({ ...content, contact: { ...content.contact, title: v } })} />
                  <Field label="Intro" value={content.contact.intro} multiline onChange={(v) => setContent({ ...content, contact: { ...content.contact, intro: v } })} />
                  <Field label="Form eyebrow" value={content.contact.formEyebrow} onChange={(v) => setContent({ ...content, contact: { ...content.contact, formEyebrow: v } })} />
                  <Field label="Form note" value={content.contact.formNote} onChange={(v) => setContent({ ...content, contact: { ...content.contact, formNote: v } })} />
                  <Field label="Success message" value={content.contact.successMessage} onChange={(v) => setContent({ ...content, contact: { ...content.contact, successMessage: v } })} />
                  <Field label="Error message" value={content.contact.errorMessage} onChange={(v) => setContent({ ...content, contact: { ...content.contact, errorMessage: v } })} />
                  <Field label="Name label" value={content.contact.nameLabel || 'Name'} onChange={(v) => setContent({ ...content, contact: { ...content.contact, nameLabel: v } })} />
                  <Field label="Name placeholder" value={content.contact.namePlaceholder || ''} onChange={(v) => setContent({ ...content, contact: { ...content.contact, namePlaceholder: v } })} />
                  <Field label="Email label" value={content.contact.emailLabel || 'Email'} onChange={(v) => setContent({ ...content, contact: { ...content.contact, emailLabel: v } })} />
                  <Field label="Email placeholder" value={content.contact.emailPlaceholder || ''} onChange={(v) => setContent({ ...content, contact: { ...content.contact, emailPlaceholder: v } })} />
                  <Field label="Phone label" value={content.contact.phoneLabel || 'Phone'} onChange={(v) => setContent({ ...content, contact: { ...content.contact, phoneLabel: v } })} />
                  <Field label="Phone placeholder" value={content.contact.phonePlaceholder || ''} onChange={(v) => setContent({ ...content, contact: { ...content.contact, phonePlaceholder: v } })} />
                  <Field label="Message label" value={content.contact.messageLabel || 'Message'} onChange={(v) => setContent({ ...content, contact: { ...content.contact, messageLabel: v } })} />
                  <Field label="Message placeholder" value={content.contact.messagePlaceholder || ''} onChange={(v) => setContent({ ...content, contact: { ...content.contact, messagePlaceholder: v } })} />
                  <Field label="Submit button" value={content.contact.submitLabel || 'Send message'} onChange={(v) => setContent({ ...content, contact: { ...content.contact, submitLabel: v } })} />
                  <Field label="Sending button" value={content.contact.sendingLabel || 'Sending…'} onChange={(v) => setContent({ ...content, contact: { ...content.contact, sendingLabel: v } })} />
                </SectionSave>
              </div>
            )}

            {tab === 'pages' && (
              <div className="max-w-3xl">
                <Guide
                  title="Other pages"
                  what="The /projects “coming soon” page and the 404 “page not found” page."
                  how="Edit the titles and paragraphs, then save."
                  happens="Those pages update after rebuild."
                />
                <SectionSave busy={busy} onSave={() => saveContent(content)} title="Projects page">
                  <Field label="Eyebrow" value={content.projectsPage?.eyebrow || ''} onChange={(v) => setContent({ ...content, projectsPage: { ...content.projectsPage, eyebrow: v } })} />
                  <Field label="Title" value={content.projectsPage?.title || ''} onChange={(v) => setContent({ ...content, projectsPage: { ...content.projectsPage, title: v } })} />
                  <Field label="Body" value={content.projectsPage?.body || ''} multiline onChange={(v) => setContent({ ...content, projectsPage: { ...content.projectsPage, body: v } })} />
                </SectionSave>
                <div className="h-4" />
                <SectionSave busy={busy} onSave={() => saveContent(content)} title="404 page">
                  <Field label="Title" value={content.notFoundPage?.title || ''} onChange={(v) => setContent({ ...content, notFoundPage: { ...content.notFoundPage, title: v } })} />
                  <Field label="Body" value={content.notFoundPage?.body || ''} multiline onChange={(v) => setContent({ ...content, notFoundPage: { ...content.notFoundPage, body: v } })} />
                  <Field label="Button text" value={content.notFoundPage?.ctaLabel || ''} onChange={(v) => setContent({ ...content, notFoundPage: { ...content.notFoundPage, ctaLabel: v } })} />
                </SectionSave>
              </div>
            )}

            {tab === 'security' && (
              <form
                onSubmit={onChangePassword}
                className="soft-panel max-w-lg space-y-5 border border-ink/10 bg-white p-6 md:p-8"
              >
                <Guide
                  title="Change your login password"
                  what="The password that unlocks this editor."
                  how="Type your current password, then a new one twice. New password needs 12+ characters with upper, lower, number, and a symbol."
                  happens="The old password stops working everywhere. Other browsers are signed out. Only the new password works."
                />
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-ink/70">Current password</span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm outline-none focus:border-brand"
                    required
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-ink/70">New password</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm outline-none focus:border-brand"
                    required
                    minLength={12}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-ink/70">Confirm new password</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2.5 text-sm outline-none focus:border-brand"
                    required
                    minLength={12}
                  />
                </label>
                <button type="submit" disabled={busy} className="btn btn-primary">
                  {busy ? 'Updating…' : 'Update password'}
                </button>
              </form>
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
