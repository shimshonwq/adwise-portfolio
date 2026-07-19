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
  gradient: string
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
    description: 'A bold, modern brand identity and logo system built for scale.',
    fullDescription:
      'We crafted a distinctive brand identity for Adwise Media — from the core logomark and typography to a flexible color system and usage guidelines. The result is a confident, energetic look that works everywhere from social avatars to billboards.',
    category: 'Logo Design',
    gradient: 'linear-gradient(135deg, #fdc621 0%, #e5ad0d 100%)',
    tags: ['Logo Design', 'Brand Identity', 'Art Direction'],
    results: [
      { label: 'Brand assets', value: '40+' },
      { label: 'Recognition lift', value: '3x' },
    ],
    deliverables: ['Primary & secondary logos', 'Color & type system', 'Brand guidelines'],
  },
  {
    id: 2,
    title: 'Social Media Growth Campaign',
    slug: 'social-media-campaign',
    client: 'Lifestyle Brand',
    year: '2025',
    description: 'Multi-platform campaign that turned followers into customers.',
    fullDescription:
      'A full-funnel social strategy across Instagram, TikTok, and Facebook — combining a content calendar, short-form video, and paid amplification. We focused on hooks, consistency, and community, driving a 250% jump in engagement in three months.',
    category: 'Marketing',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #fdc621 130%)',
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
    description: 'A complete design system that keeps every touchpoint on-brand.',
    fullDescription:
      'We documented a comprehensive brand system: color palettes, typographic scale, imagery direction, iconography, and logo usage rules. The living guideline empowers internal teams and partners to ship consistent, high-quality work fast.',
    category: 'Branding',
    gradient: 'linear-gradient(135deg, #fdc621 0%, #e5ad0d 55%, #1a1a1a 130%)',
    tags: ['Design System', 'Guidelines', 'Typography'],
    results: [
      { label: 'Consistency', value: '100%' },
      { label: 'Faster handoff', value: '2x' },
    ],
    deliverables: ['Design tokens', 'Usage rules', 'Asset library'],
  },
  {
    id: 4,
    title: 'Content Creation Series',
    slug: 'content-creation',
    client: 'Wellness Studio',
    year: '2024',
    description: 'Monthly content engine — video, blog, and infographics.',
    fullDescription:
      'A repeatable content engine covering short-form video, editorial blog posts, and shareable infographics. Every piece maps back to brand pillars and business goals, keeping the audience engaged and the pipeline full.',
    category: 'Content',
    gradient: 'linear-gradient(135deg, #fdc621 0%, #ffe066 100%)',
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
    description: 'Print & digital collateral that stays perfectly on-brand.',
    fullDescription:
      'From business cards and brochures to pitch decks and promotional graphics, we designed a cohesive suite of marketing collateral that maintains brand consistency across every customer touchpoint — online and in print.',
    category: 'Marketing',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #3a3218 55%, #fdc621 140%)',
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
      'We designed multiple high-fidelity website concepts focused on user experience, clarity, and conversion. Clean layouts, strong visual hierarchy, and thoughtful motion combine into a modern, trustworthy digital presence.',
    category: 'Branding',
    gradient: 'linear-gradient(135deg, #fdc621 0%, #e5ad0d 50%, #1a1a1a 130%)',
    tags: ['Web Design', 'UI/UX', 'Prototyping'],
    results: [
      { label: 'Prototypes', value: '3' },
      { label: 'Bounce rate', value: '-30%' },
    ],
    deliverables: ['Wireframes', 'Hi-fi mockups', 'Interactive prototype'],
  },
]

export const categories: ('All' | Category)[] = [
  'All',
  'Logo Design',
  'Marketing',
  'Content',
  'Branding',
]
