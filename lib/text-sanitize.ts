/**
 * Fix mojibake (UTF-8 bytes shown as Windows-1252) and normalize fancy punctuation.
 * Example: you’re → youâ€™re · — → â€” · · → Â·
 */

/** UTF-8 bytes of a char, re-read as Latin-1/CP1252 code units */
function utf8Misread(char: string): string {
  const bytes = new TextEncoder().encode(char)
  let out = ''
  for (const b of bytes) out += String.fromCharCode(b)
  return out
}

const REPLACEMENTS: Array<[string, string]> = [
  [utf8Misread('\u2019'), "'"],
  [utf8Misread('\u2018'), "'"],
  [utf8Misread('\u201C'), '"'],
  [utf8Misread('\u201D'), '"'],
  [utf8Misread('\u2014'), ' - '],
  [utf8Misread('\u2013'), '-'],
  [utf8Misread('\u2026'), '...'],
  [utf8Misread('\u00B7'), ' | '],
  // literal leftovers sometimes pasted into JSON
  ['Â·', ' | '],
]

export function sanitizeText(input: string): string {
  let s = String(input ?? '')
  for (const [bad, good] of REPLACEMENTS) {
    if (bad && s.includes(bad)) s = s.split(bad).join(good)
  }
  s = s
    .replace(/\u2019|\u2018/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2014/g, ' - ')
    .replace(/\u2013/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/\u00B7/g, ' | ')
  s = s.replace(/\s+\|\s+/g, ' | ')
  s = s.replace(/ {2,}/g, ' ')
  return s
}

export function sanitizeDeep<T>(value: T): T {
  if (typeof value === 'string') return sanitizeText(value) as T
  if (Array.isArray(value)) return value.map((v) => sanitizeDeep(v)) as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = sanitizeDeep(v)
    }
    return out as T
  }
  return value
}
