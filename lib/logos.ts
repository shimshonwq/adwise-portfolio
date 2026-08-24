/** Shared logo types + default strip (used when the admin API is empty/unavailable). */

export type LogoItem = {
  id: string
  name: string
  /** Public URL or data URL for the mark */
  src: string
}

export const DEFAULT_LOGOS: LogoItem[] = [
  { id: 'kalmys', name: 'Kalmys', src: '/clients/kalmys.png' },
  { id: 'shloimy', name: 'Shloimy Friedlander', src: '/clients/shloimy.png' },
  { id: 'coffee-break', name: 'Coffee Break', src: '/clients/coffee-break.png' },
  { id: 'flavor-max', name: 'Flavor Max', src: '/clients/flavor-max.png' },
  { id: 'ride-24', name: 'Ride 24', src: '/clients/ride-24.png' },
  { id: 'planit', name: 'Planit Architecture', src: '/clients/planit.png' },
  { id: 'icontact', name: 'iContact Studio', src: '/clients/icontact.png' },
  { id: 'garden-gourmet', name: 'Garden Gourmet', src: '/clients/garden-gourmet.png' },
  { id: 'hvn', name: 'HVN', src: '/clients/hvn.png' },
  { id: 'vish-vash', name: 'Vish Vash', src: '/clients/vish-vash.png' },
  { id: 'shvitz', name: 'The Shvitz', src: '/clients/shvitz.png' },
  { id: 'greenpower', name: 'Green Power Electric', src: '/clients/greenpower.png' },
  { id: 'mendel-style', name: 'Mendel Style Events', src: '/clients/mendel-style.png' },
]

export const LOGOS_KV_KEY = 'logos:v1'
export const ADMIN_COOKIE = 'adwise_admin'
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 14 // 14 days
