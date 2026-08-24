/**
 * Fix mojibake (UTF-8 bytes shown as Windows-1252) and normalize fancy punctuation.
 */
function utf8Misread(char) {
  const bytes = new TextEncoder().encode(char)
  let out = ''
  for (const b of bytes) out += String.fromCharCode(b)
  return out
}

const REPLACEMENTS = [
  [utf8Misread('\u2019'), "'"],
  [utf8Misread('\u2018'), "'"],
  [utf8Misread('\u201C'), '"'],
  [utf8Misread('\u201D'), '"'],
  [utf8Misread('\u2014'), ' - '],
  [utf8Misread('\u2013'), '-'],
  [utf8Misread('\u2026'), '...'],
  [utf8Misread('\u00B7'), ' | '],
  ['Â·', ' | '],
]

export function sanitizeText(input) {
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

export function sanitizeDeep(value) {
  if (typeof value === 'string') return sanitizeText(value)
  if (Array.isArray(value)) return value.map((v) => sanitizeDeep(v))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = sanitizeDeep(v)
    return out
  }
  return value
}
