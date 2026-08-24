/** Logo upload rules for local admin API (keep in sync with lib/logo-rules.ts) */

export const LOGO_ACCEPT_MIME = ['image/png', 'image/jpeg', 'image/webp']
export const LOGO_EXT_LABEL = 'PNG, JPG, or WebP'
export const LOGO_MAX_BYTES = 2 * 1024 * 1024
export const LOGO_MIN_WIDTH = 200
export const LOGO_MAX_WIDTH = 2400
export const LOGO_MIN_HEIGHT = 40
export const LOGO_MAX_HEIGHT = 1200

export function logoMimeOk(mime) {
  return LOGO_ACCEPT_MIME.includes(mime)
}

export function extForLogoMime(mime) {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/webp') return 'webp'
  return null
}

export function validateLogoUpload({ mime, size, width, height }) {
  if (!logoMimeOk(mime)) {
    return `Wrong file type. Use ${LOGO_EXT_LABEL} only.`
  }
  if (size > LOGO_MAX_BYTES) {
    return 'File is too big. Max size is 2 MB.'
  }
  if (width != null && height != null) {
    if (width < LOGO_MIN_WIDTH || width > LOGO_MAX_WIDTH) {
      return `Width must be ${LOGO_MIN_WIDTH}–${LOGO_MAX_WIDTH}px (got ${width}px).`
    }
    if (height < LOGO_MIN_HEIGHT || height > LOGO_MAX_HEIGHT) {
      return `Height must be ${LOGO_MIN_HEIGHT}–${LOGO_MAX_HEIGHT}px (got ${height}px).`
    }
  }
  return null
}
