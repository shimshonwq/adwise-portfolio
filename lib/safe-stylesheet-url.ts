const ALLOWED_FONT_HOSTS = new Set([
  'fonts.googleapis.com',
  'fonts.gstatic.com',
])

/** Only allow Google Fonts stylesheets from CMS custom font URLs. */
export function safeStylesheetUrl(raw: string): string | null {
  const u = String(raw || '').trim()
  if (!u.startsWith('https://')) return null
  try {
    const parsed = new URL(u)
    if (parsed.protocol !== 'https:') return null
    if (!ALLOWED_FONT_HOSTS.has(parsed.hostname)) return null
    return parsed.href
  } catch {
    return null
  }
}
