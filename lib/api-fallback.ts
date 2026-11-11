/** Shared helpers for public API origin + challenge detection. */

export const WORKERS_API = 'https://adwise-portfolio.adwisecreativity.workers.dev'

export function looksLikeChallenge(text: string): boolean {
  const t = String(text || '').toLowerCase()
  return (
    t.includes('just a moment') ||
    t.includes('cf-mitigated') ||
    t.includes('challenge-platform') ||
    t.includes('<!doctype html')
  )
}

/**
 * Fetch JSON from same-origin first, then workers.dev if CF challenges the zone.
 */
export async function fetchJsonWithFallback<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  const urls = [path, `${WORKERS_API}${path}`]
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        ...init,
        cache: 'no-store',
        credentials: url.startsWith('/') ? 'same-origin' : 'omit',
        mode: 'cors',
      })
      const raw = await res.text()
      if (looksLikeChallenge(raw)) continue
      if (!res.ok) continue
      return JSON.parse(raw) as T
    } catch {
      /* try next */
    }
  }
  return null
}
