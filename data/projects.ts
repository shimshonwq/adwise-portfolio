export type Category = 'Logo Design' | 'Marketing' | 'Content' | 'Branding'

export interface Project {
  id: number
  title: string
  slug: string
  client: string
  year: string
  description: string
  fullDescription: string
  category: Category
  /** CSS gradient used as the project visual plane */
  gradient: string
  accent: string
  tags: string[]
  results?: { label: string; value: string }[]
  deliverables?: string[]
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Adwise Brand Identity',
    slug: 'adwise-brand-identity',
    client: 'Adwise Media',
    year: '2025',
    description: 'A bold identity system built to scale from social avatars to billboards.',
    fullDescription:
      'We crafted a distinctive brand identity for Adwise Media — from the core logomark and typography to a flexible color system and usage guidelines. The result is a confident, energetic look that works everywhere from social avatars to billboards.',
    category: 'Logo Design',
    gradient: 'linear-gradient(145deg, #fdc621 0%, #f0b400 45%, #121212 120%)',
    accent: '#fdc621',
    tags: ['Logo Design', 'Brand Identity', 'Art Direction'],
    results: [
      { label: 'Brand assets', value: '40+' },
      { label: 'Recognition lift', value: '3×' },
    ],
    deliverables: ['Primary & secondary logos', 'Color & type system', 'Brand guidelines'],
  },
  {
    id: 2,
    title: 'Social Growth Campaign',
    slug: 'social-media-campaign',
    client: 'Lifestyle Brand',
    year: '2025',
    description: 'A multi-platform campaign that turned attention into customers.',
    fullDescription:
      'A full-funnel social strategy across Instagram, TikTok, and Facebook — combining a content calendar, short-form video, and paid amplification. Focused on hooks, consistency, and community, driving a 250% jump in engagement in three months.',
    category: 'Marketing',
    gradient: 'linear-gradient(145deg, #1a1a1a 0%, #3d3420 55%, #fdc621 130%)',
    accent: '#fdc621',
    tags: ['Social Strategy', 'Paid Ads', 'Community'],
    results: [
      { label: 'Engagement', value: '+250%' },
      { label: 'Followers', value: '+38k' },
    ],
    deliverables: ['Content calendar', 'Short-form video', 'Paid media management'],
  },
  {
    id: 3,
    title: 'Brand Guidelines System',
    slug: 'brand-guidelines',
    client: 'Tech Startup',
    year: '2024',
    description: 'A living design system that keeps every touchpoint on-brand.',
    fullDescription:
      'We documented a comprehensive brand system: color palettes, typographic scale, imagery direction, iconography, and logo usage rules. The living guideline empowers teams and partners to ship consistent, high-quality work fast.',
    category: 'Branding',
    gradient: 'linear-gradient(145deg, #fdc621 0%, #fff3b0 50%, #2a2a2a 125%)',
    accent: '#e0ad00',
    tags: ['Design System', 'Guidelines', 'Typography'],
    results: [
      { label: 'Consistency', value: '100%' },
      { label: 'Faster handoff', value: '2×' },
    ],
    deliverables: ['Design tokens', 'Usage rules', 'Asset library'],
  },
  {
    id: 4,
    title: 'Content Creation Engine',
    slug: 'content-creation',
    client: 'Wellness Studio',
    year: '2024',
    description: 'A monthly content engine — video, editorial, and shareable design.',
    fullDescription:
      'A repeatable content engine covering short-form video, editorial posts, and shareable graphics. Every piece maps back to brand pillars and business goals, keeping the audience engaged and the pipeline full.',
    category: 'Content',
    gradient: 'linear-gradient(145deg, #ffe066 0%, #fdc621 40%, #121212 120%)',
    accent: '#fdc621',
    tags: ['Content Creation', 'Video', 'Copywriting'],
    results: [
      { label: 'Reach', value: '1.2M' },
      { label: 'Watch time', value: '+180%' },
    ],
    deliverables: ['Video production', 'Editorial calendar', 'Infographics'],
  },
  {
    id: 5,
    title: 'Marketing Collateral Suite',
    slug: 'marketing-collateral',
    client: 'Local Business',
    year: '2024',
    description: 'Print and digital collateral that stays perfectly on-brand.',
    fullDescription:
      'From business cards and brochures to pitch decks and promotional graphics, we designed a cohesive suite of marketing collateral that maintains brand consistency across every customer touchpoint.',
    category: 'Marketing',
    gradient: 'linear-gradient(145deg, #121212 0%, #2c2410 50%, #fdc621 140%)',
    accent: '#fdc621',
    tags: ['Print Design', 'Brochures', 'Pitch Decks'],
    results: [
      { label: 'Touchpoints', value: '12+' },
      { label: 'Conversion', value: '+22%' },
    ],
    deliverables: ['Business cards', 'Brochures', 'Sales decks'],
  },
  {
    id: 6,
    title: 'Website Design Concepts',
    slug: 'website-design',
    client: 'E-commerce Brand',
    year: '2025',
    description: 'Conversion-focused web design with a premium feel.',
    fullDescription:
      'We designed high-fidelity website concepts focused on clarity, hierarchy, and conversion. Clean layouts and thoughtful motion combine into a modern, trustworthy digital presence.',
    category: 'Branding',
    gradient: 'linear-gradient(145deg, #fdc621 0%, #e0ad00 40%, #121212 115%)',
    accent: '#fdc621',
    tags: ['Web Design', 'UI/UX', 'Prototyping'],
    results: [
      { label: 'Prototypes', value: '3' },
      { label: 'Bounce rate', value: '−30%' },
    ],
    deliverables: ['Wireframes', 'Hi-fi mockups', 'Interactive prototype'],
  },
]
