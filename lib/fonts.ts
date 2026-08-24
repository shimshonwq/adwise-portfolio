/** Font presets for CMS theme (loaded via Google Fonts CSS when needed). */

export type FontRole = 'display' | 'body' | 'serif'

export type FontPreset = {
  id: string
  label: string
  /** CSS font-family stack */
  stack: string
  /** Google Fonts family query piece, empty if system/bundled default */
  google?: string
}

export const DISPLAY_FONTS: FontPreset[] = [
  {
    id: 'bricolage',
    label: 'Bricolage Grotesque (default)',
    stack: '"Bricolage Grotesque", ui-sans-serif, sans-serif',
    google: 'Bricolage+Grotesque:wght@600;700',
  },
  {
    id: 'playfair',
    label: 'Playfair Display',
    stack: '"Playfair Display", Georgia, serif',
    google: 'Playfair+Display:wght@600;700',
  },
  {
    id: 'oswald',
    label: 'Oswald',
    stack: 'Oswald, ui-sans-serif, sans-serif',
    google: 'Oswald:wght@500;600;700',
  },
  {
    id: 'bebas',
    label: 'Bebas Neue',
    stack: '"Bebas Neue", Impact, sans-serif',
    google: 'Bebas+Neue',
  },
  {
    id: 'space-grotesk',
    label: 'Space Grotesk',
    stack: '"Space Grotesk", ui-sans-serif, sans-serif',
    google: 'Space+Grotesk:wght@500;600;700',
  },
  { id: 'custom', label: 'Custom (your own)', stack: '' },
]

export const BODY_FONTS: FontPreset[] = [
  {
    id: 'sora',
    label: 'Sora (default)',
    stack: 'Sora, ui-sans-serif, sans-serif',
    google: 'Sora:wght@400;500;600;700',
  },
  {
    id: 'inter',
    label: 'Inter',
    stack: 'Inter, ui-sans-serif, sans-serif',
    google: 'Inter:wght@400;500;600;700',
  },
  {
    id: 'dm-sans',
    label: 'DM Sans',
    stack: '"DM Sans", ui-sans-serif, sans-serif',
    google: 'DM+Sans:wght@400;500;600;700',
  },
  {
    id: 'nunito',
    label: 'Nunito',
    stack: 'Nunito, ui-sans-serif, sans-serif',
    google: 'Nunito:wght@400;600;700',
  },
  {
    id: 'system',
    label: 'System default',
    stack: 'ui-sans-serif, system-ui, sans-serif',
  },
  { id: 'custom', label: 'Custom (your own)', stack: '' },
]

export const SERIF_FONTS: FontPreset[] = [
  {
    id: 'eb-garamond',
    label: 'EB Garamond italic (default)',
    stack: '"EB Garamond", Garamond, Georgia, serif',
    google: 'EB+Garamond:ital,wght@1,400;1,500;1,600',
  },
  {
    id: 'libre-baskerville',
    label: 'Libre Baskerville',
    stack: '"Libre Baskerville", Georgia, serif',
    google: 'Libre+Baskerville:ital,wght@0,400;1,400',
  },
  {
    id: 'lora',
    label: 'Lora',
    stack: 'Lora, Georgia, serif',
    google: 'Lora:ital,wght@0,400;1,400;1,600',
  },
  {
    id: 'merriweather',
    label: 'Merriweather',
    stack: 'Merriweather, Georgia, serif',
    google: 'Merriweather:ital,wght@0,400;1,400',
  },
  { id: 'custom', label: 'Custom (your own)', stack: '' },
]

export function resolveFontStack(
  role: FontRole,
  presetId: string | undefined,
  customName: string | undefined,
): string {
  const list = role === 'display' ? DISPLAY_FONTS : role === 'body' ? BODY_FONTS : SERIF_FONTS
  const id = presetId || list[0].id
  if (id === 'custom') {
    const name = (customName || '').trim()
    if (!name) return list[0].stack
    return name.includes(',') ? name : `"${name.replace(/"/g, '')}", sans-serif`
  }
  return list.find((f) => f.id === id)?.stack || list[0].stack
}

export function googleFontsHref(theme: {
  fontDisplay?: string
  fontBody?: string
  fontSerif?: string
  fontDisplayUrl?: string
  fontBodyUrl?: string
  fontSerifUrl?: string
}): string | null {
  const families: string[] = []
  const add = (list: FontPreset[], id?: string) => {
    if (!id || id === 'custom') return
    const g = list.find((f) => f.id === id)?.google
    if (g) families.push(`family=${g}`)
  }
  add(DISPLAY_FONTS, theme.fontDisplay)
  add(BODY_FONTS, theme.fontBody)
  add(SERIF_FONTS, theme.fontSerif)

  const customUrls = [theme.fontDisplayUrl, theme.fontBodyUrl, theme.fontSerifUrl].filter(
    (u) => u && String(u).includes('fonts.googleapis.com'),
  ) as string[]

  if (!families.length && !customUrls.length) return null
  if (customUrls.length && !families.length) return customUrls[0]
  if (!families.length) return null
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}
