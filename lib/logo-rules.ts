/** Client logo upload rules — enforced in admin UI + API */

export const LOGO_ACCEPT_MIME = ['image/png', 'image/jpeg', 'image/webp'] as const
export const LOGO_ACCEPT_ATTR = 'image/png,image/jpeg,image/webp'
export const LOGO_EXT_LABEL = 'PNG, JPG, or WebP'
export const LOGO_MAX_BYTES = 2 * 1024 * 1024 // 2 MB
export const LOGO_MIN_WIDTH = 200
export const LOGO_MAX_WIDTH = 2400
export const LOGO_MIN_HEIGHT = 40
export const LOGO_MAX_HEIGHT = 1200
/** Best look in the sliding logo bar */
export const LOGO_BEST_WIDTH = '400–800px wide'
export const LOGO_BEST_HEIGHT = 'about 120–200px tall'
export const LOGO_BEST_TIP =
  'Transparent PNG looks best on the white clients bar. Keep the logo centered with a little empty space around it.'

export function logoMimeOk(mime: string) {
  return (LOGO_ACCEPT_MIME as readonly string[]).includes(mime)
}

export function extForLogoMime(mime: string) {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/webp') return 'webp'
  return null
}

export const LOGO_HELP = {
  title: 'Add a client logo',
  what: 'This puts a company logo on the sliding “Brands we work with” bar on your homepage.',
  how: `1. Type the company name.
2. Choose a picture file (${LOGO_EXT_LABEL} only — not SVG, PDF, or HEIC).
3. Best size: ${LOGO_BEST_WIDTH}, ${LOGO_BEST_HEIGHT}.
4. File must be under 2 MB.
5. Click “Add logo”.`,
  happens:
    'We save the file to your site and push it to GitHub. Cloudflare rebuilds in about 1–3 minutes, then visitors see the new logo.',
  rules: `${LOGO_BEST_TIP} Width must be ${LOGO_MIN_WIDTH}–${LOGO_MAX_WIDTH}px. Height must be ${LOGO_MIN_HEIGHT}–${LOGO_MAX_HEIGHT}px.`,
}
