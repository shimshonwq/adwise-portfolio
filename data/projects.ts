export type Category = 'Logos' | 'Branding' | 'Signage' | 'Print'

export interface Project {
  id: number
  title: string
  slug: string
  client: string
  year: string
  description: string
  fullDescription: string
  category: Category
  /** Stage background behind the artwork */
  surface: string
  /** Text color on the stage */
  theme: 'light' | 'dark'
  gradient: string
  tags: string[]
  coverImage: string
  gallery?: string[]
  videoUrl?: string
  link?: string
  results?: { label: string; value: string }[]
  deliverables?: string[]
}

export const categories: Array<'All' | Category> = [
  'All',
  'Logos',
  'Branding',
  'Signage',
  'Print',
]

export const projects: Project[] = [
  {
    id: 1,
    title: 'Gebecks Heimische Bakery',
    slug: 'gebecks-bakery',
    client: 'Gebecks',
    year: '2025',
    description: 'A refined bakery identity — elegant serif wordmark, wheat mark, and brand lines.',
    fullDescription:
      'A complete identity system for Gebecks Heimische Bakery. We designed a high-contrast serif wordmark with a custom wheat mark growing from the “K,” plus supporting iconography and brand language — Fresh. Heimish. Geshmak. — that feels artisanal, premium, and rooted in tradition.',
    category: 'Branding',
    surface: '#f3efe6',
    theme: 'dark',
    gradient: 'linear-gradient(145deg, #f4f1ea 0%, #ebe6db 55%, #121212 140%)',
    tags: ['Logo Design', 'Brand System', 'Typography'],
    coverImage: '/projects/gebecks-bakery/cover.png',
    gallery: [
      '/projects/gebecks-bakery/logo.png',
      '/projects/gebecks-bakery/icon.png',
      '/projects/gebecks-bakery/manifesto.png',
    ],
    deliverables: ['Primary logo', 'Wheat icon', 'Brand manifesto graphics'],
  },
  {
    id: 2,
    title: 'Planit Architecture & Design',
    slug: 'planit-architecture',
    client: 'Planit',
    year: '2025',
    description: 'A blueprint-inspired monogram and wordmark for a modern architecture studio.',
    fullDescription:
      'Planit needed an identity that felt architectural without feeling cold. We built a bold PI monogram with subtle drafting-grid texture inside the letterforms, paired with a clean, widely tracked “Architecture & Design” lockup — precise, modern, and built to last.',
    category: 'Logos',
    surface: '#f7f5f0',
    theme: 'dark',
    gradient: 'linear-gradient(145deg, #f4f1ea 0%, #d9d3c6 60%, #2a2a2a 130%)',
    tags: ['Logo Design', 'Monogram', 'Architecture'],
    coverImage: '/projects/planit-architecture/cover.png',
    deliverables: ['Monogram mark', 'Primary wordmark', 'Lockup system'],
  },
  {
    id: 3,
    title: 'Shloimy Friedlander Productions',
    slug: 'shloimy-friedlander',
    client: 'Shloimy Friedlander',
    year: '2025',
    description: 'A bold production brand mark and event-focused poster system.',
    fullDescription:
      'Identity work for Shloimy Friedlander Productions — a distinctive abstract mark, a strong squared display wordmark, and a campaign poster line: “Playing a role in your next event.” Clean, high-contrast, and built for stages and screens.',
    category: 'Branding',
    surface: '#2b2b2b',
    theme: 'light',
    gradient: 'linear-gradient(145deg, #2a2a2a 0%, #121212 50%, #fdc621 140%)',
    tags: ['Logo Design', 'Poster', 'Event Branding'],
    coverImage: '/projects/shloimy-friedlander/cover.png',
    gallery: ['/projects/shloimy-friedlander/poster.png'],
    deliverables: ['Logo mark', 'Wordmark', 'Poster graphic'],
  },
  {
    id: 4,
    title: 'iContact Studio',
    slug: 'icontact-studio',
    client: 'iContact Studio',
    year: '2025',
    description: 'Photography & media branding — logo, studio lockups, and contact collateral.',
    fullDescription:
      'Brand identity for iContact Studio spanning logo design and promotional collateral. A golden wordmark with a lens/eye detail on the “i,” deep teal photography lockups, and a “we tell your product’s story” business card concept with QR and contact paths.',
    category: 'Branding',
    surface: '#ffffff',
    theme: 'dark',
    gradient: 'linear-gradient(145deg, #004d54 0%, #0a2f33 55%, #d99d3b 130%)',
    tags: ['Logo Design', 'Photography', 'Collateral'],
    coverImage: '/projects/icontact-studio/cover.png',
    gallery: [
      '/projects/icontact-studio/photography.png',
      '/projects/icontact-studio/lockup.png',
    ],
    deliverables: ['Primary logo', 'Photography lockup', 'Business card concept'],
  },
  {
    id: 5,
    title: 'Green Power Electric',
    slug: 'green-power-electric',
    client: 'Green Power Electric Inc.',
    year: '2024',
    description: 'Energetic logo system for an electrical company — bolt, circuit ring, clear hierarchy.',
    fullDescription:
      'A confident identity for Green Power Electric Inc. We paired a sharp lightning bolt with a circular circuit swoosh and a clear GREEN / POWER / ELECTRIC INC. stack — energetic, trustworthy, and instantly readable on trucks, signs, and social.',
    category: 'Logos',
    surface: '#d7ef7a',
    theme: 'dark',
    gradient: 'linear-gradient(145deg, #c8e86c 0%, #5aa83a 50%, #121212 125%)',
    tags: ['Logo Design', 'Trade Branding', 'Iconography'],
    coverImage: '/projects/green-power-electric/cover.png',
    deliverables: ['Primary logo', 'Icon mark', 'Color system'],
  },
  {
    id: 6,
    title: 'Vish Vash Car Wash Sign',
    slug: 'vish-vash-carwash',
    client: 'Vish Vash',
    year: '2025',
    description: 'High-impact outdoor signage for a premium car wash and detailing brand.',
    fullDescription:
      'Full-bleed signage design for Vish Vash Car Wash and Detailing — bold stacked wordmark, bubble-and-vehicle icon system, and a cinematic luxury-vehicle presentation with water and reflection. Built to stop traffic and feel premium from across the lot.',
    category: 'Signage',
    surface: '#0b1a2e',
    theme: 'light',
    gradient: 'linear-gradient(145deg, #0a1628 0%, #1565c0 55%, #4fc3f7 120%)',
    tags: ['Signage', 'Graphic Design', 'Outdoor'],
    coverImage: '/projects/vish-vash-carwash/cover.jpg',
    deliverables: ['Primary sign artwork', 'Logo lockup', 'Vehicle presentation'],
  },
  {
    id: 7,
    title: 'Artisan Hebrew Wordmark',
    slug: 'artisan-hebrew-wordmark',
    client: 'Private Client',
    year: '2024',
    description: 'Warm custom Hebrew lettering with portrait detail and bakery motifs.',
    fullDescription:
      'A custom Hebrew wordmark with soft, rounded letterforms in burnt orange, an illustrated portrait nestled in the letterforms, and supporting steam and wheat motifs. Friendly, cultural, and full of craft — designed to feel handmade without losing polish.',
    category: 'Logos',
    surface: '#fffaf5',
    theme: 'dark',
    gradient: 'linear-gradient(145deg, #ffffff 0%, #ffe8d6 50%, #e07a2f 130%)',
    tags: ['Custom Lettering', 'Illustration', 'Logo Design'],
    coverImage: '/projects/artisan-hebrew-wordmark/cover.png',
    deliverables: ['Custom Hebrew wordmark', 'Illustration details', 'Supporting motifs'],
  },
  {
    id: 8,
    title: 'Coffee Break',
    slug: 'coffee-break',
    client: 'Coffee Break',
    year: '2024',
    description: 'Warm illustrated lockup — cup, beans, rings, and a cozy coffee mood.',
    fullDescription:
      'A cozy illustrated identity moment for Coffee Break — steaming cup, scattered beans, coffee-ring framing, and soft bokeh depth. Designed to feel inviting and instantly recognizable for café and lifestyle use.',
    category: 'Print',
    surface: '#f3e4d2',
    theme: 'dark',
    gradient: 'linear-gradient(145deg, #f5e6d3 0%, #c4a484 50%, #5c3d2e 125%)',
    tags: ['Illustration', 'Logo Design', 'Lifestyle'],
    coverImage: '/projects/coffee-break/cover.png',
    deliverables: ['Illustrated lockup', 'Icon elements'],
  },
]
