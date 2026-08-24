import { useCallback, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { DEFAULT_LOGOS, type LogoItem } from '../lib/logos'

type Phase = 'checking' | 'login' | 'app'

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

export default function LoginAdminPage() {
  const [phase, setPhase] = useState<Phase>('checking')
  const [password, setPassword] = useState('')
  const [logos, setLogos] = useState<LogoItem[]>([])
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const refresh = useCallback(async () => {
    const res = await fetch('/api/admin/logos/', { credentials: 'include' })
    if (!res.ok) throw new Error('Session expired — log in again')
    const data = await res.json()
    setLogos(Array.isArray(data.logos) ? data.logos : DEFAULT_LOGOS)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/session/', { credentials: 'include' })
        const data = await res.json()
        if (cancelled) return
        if (data.ok) {
          await refresh()
          if (!cancelled) setPhase('app')
        } else {
          setPhase('login')
        }
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
  }, [refresh])

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
      await refresh()
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
    setLogos([])
  }

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Choose a logo file first')
      return
    }
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const dataUrl = await readFileAsDataUrl(file)
      const res = await fetch('/api/admin/logos/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || file.name.replace(/\.[^.]+$/, ''),
          dataUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setLogos(data.logos)
      setName('')
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      setMessage('Logo added — it shows on the homepage logo bar right away.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  const onRemove = async (id: string) => {
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/logos/${encodeURIComponent(id)}/`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not remove')
      setLogos(data.logos)
      setMessage('Logo removed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin — Adwise Media</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-[100svh] bg-paper text-ink">
        <div className="color-rail" aria-hidden />
        <div className="site-shell py-12 md:py-16">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brass">
                Private admin
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Logo bar
              </h1>
              <p className="mt-2 max-w-md font-serif text-base italic text-ink/70">
                Upload or remove client logos. Not linked from the public site — only at /login.
              </p>
            </div>
            {phase === 'app' && (
              <button type="button" onClick={onLogout} className="btn btn-secondary text-sm">
                Log out
              </button>
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
                <span className="mb-2 block font-medium text-ink/70">Password</span>
                <input
                  type="password"
                  autoFocus
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-ink/15 bg-paper px-4 py-3.5 outline-none transition focus:border-brand"
                  placeholder="Admin password"
                  required
                />
              </label>
              {error && <p className="text-sm text-red-700">{error}</p>}
              <button type="submit" disabled={busy} className="btn btn-primary w-full">
                {busy ? 'Signing in…' : 'Log in'}
              </button>
            </form>
          )}

          {phase === 'app' && (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <form
                onSubmit={onUpload}
                className="soft-panel space-y-5 border border-ink/10 bg-white p-7 md:p-9"
              >
                <h2 className="font-display text-xl font-bold">Add a logo</h2>
                <p className="font-serif text-sm italic text-ink/65">
                  PNG, JPG, WebP, or SVG. Original colors — no filters applied.
                </p>
                <label className="block text-sm">
                  <span className="mb-2 block font-medium text-ink/70">Client name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-ink/15 bg-paper px-4 py-3.5 outline-none transition focus:border-brand"
                    placeholder="e.g. Acme Co"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-2 block font-medium text-ink/70">Logo file</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2.5 file:font-semibold file:text-ink hover:file:brightness-95"
                    required
                  />
                </label>
                {error && <p className="text-sm text-red-700">{error}</p>}
                {message && <p className="text-sm text-emerald-800">{message}</p>}
                <button type="submit" disabled={busy || !file} className="btn btn-primary">
                  {busy ? 'Uploading…' : 'Add to logo bar'}
                </button>
              </form>

              <div>
                <h2 className="font-display text-xl font-bold">On the logo bar ({logos.length})</h2>
                <p className="mt-1 font-serif text-sm italic text-ink/65">
                  Remove any mark — the homepage updates immediately.
                </p>
                <ul className="mt-6 space-y-3">
                  {logos.map((logo) => (
                    <li
                      key={logo.id}
                      className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white px-4 py-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="h-12 w-28 object-contain object-left"
                      />
                      <span className="min-w-0 flex-1 truncate font-medium">{logo.name}</span>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onRemove(logo.id)}
                        className="rounded-lg border border-ink/15 px-3 py-2 text-sm font-medium text-ink/70 transition hover:border-red-300 hover:bg-red-50 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                  {logos.length === 0 && (
                    <li className="rounded-xl border border-dashed border-ink/20 px-4 py-8 text-center font-serif italic text-ink/45">
                      No logos yet — add one on the left.
                    </li>
                  )}
                </ul>
                <p className="mt-6 text-sm text-ink/50">
                  <a href="/" className="underline hover:text-ink">
                    View homepage
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
