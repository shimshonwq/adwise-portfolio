/** Client logo upload rules — enforced in admin UI + API */

export const LOGO_ACCEPT_MIME = ['image/png', 'image/jpeg', 'image/webp'] as const
export const LOGO_ACCEPT_ATTR = 'image/png,image/jpeg,image/webp'
export const LOGO_EXT_LABEL = 'PNG, JPG, or WebP'
export const LOGO_MAX_BYTES = 5 * 1024 * 1024 // 5 MB (cropped uploads are usually small)
export const LOGO_MIN_WIDTH = 100
export const LOGO_MAX_WIDTH = 2400
export const LOGO_MIN_HEIGHT = 32
export const LOGO_MAX_HEIGHT = 1200
export const LOGO_EXPORT_WIDTH = 800
export const LOGO_EXPORT_HEIGHT = 160
export const LOGO_SOURCE_MAX_BYTES = 12 * 1024 * 1024
/** Best look in the sliding logo bar */
export const LOGO_BEST_WIDTH = 'any size (we resize for you)'
export const LOGO_BEST_HEIGHT = 'drag & zoom to fit the bar'
export const LOGO_BEST_TIP =
  'Pick any clear logo photo — use the preview box to zoom and move it. Transparent PNG looks best on the white bar.'

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
2. Choose a picture (${LOGO_EXT_LABEL}) — any size is fine.
3. Drag and zoom in the preview until it looks right.
4. Optional: add their website link.
5. Click “Add logo”.`,
  happens:
    'We save the cropped logo and update the live site for every visitor within a few seconds.',
  rules: `${LOGO_BEST_TIP} Large phone photos are OK — we shrink them automatically.`,
}
