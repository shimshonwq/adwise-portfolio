export interface Project {
  id: number
  title: string
  slug: string
  description: string
  fullDescription?: string
  category: 'Logo Design' | 'Marketing' | 'Content' | 'Branding'
  image?: string
  tags?: string[]
  link?: string
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Adwise Logo Design',
    slug: 'adwise-logo',
    description: 'Modern brand identity and logo design for Adwise Media',
    fullDescription: 'Created a distinctive logo and brand identity for Adwise Media that reflects innovation and creativity in the marketing space.',
    category: 'Logo Design',
    tags: ['Logo Design', 'Branding', 'Identity'],
    image: '/images/projects/logo.jpg',
  },
  {
    id: 2,
    title: 'Social Media Campaign',
    slug: 'social-media-campaign',
    description: 'Multi-platform social media marketing campaign',
    fullDescription: 'Developed and executed a comprehensive social media strategy across Instagram, Facebook, and TikTok resulting in 250% engagement increase.',
    category: 'Marketing',
    tags: ['Social Media', 'Marketing Strategy', 'Content'],
    image: '/images/projects/social.jpg',
  },
  {
    id: 3,
    title: 'Brand Guidelines',
    slug: 'brand-guidelines',
    description: 'Complete brand guidelines and style system',
    fullDescription: 'Comprehensive brand guidelines including color palettes, typography, imagery style, and logo usage rules.',
    category: 'Branding',
    tags: ['Branding', 'Design System', 'Guidelines'],
    image: '/images/projects/guidelines.jpg',
  },
  {
    id: 4,
    title: 'Content Creation Series',
    slug: 'content-creation',
    description: 'Monthly content creation and strategy',
    fullDescription: 'Created engaging video content, blog posts, and infographics for brand storytelling and audience engagement.',
    category: 'Content',
    tags: ['Content Creation', 'Video', 'Design'],
    image: '/images/projects/content.jpg',
  },
  {
    id: 5,
    title: 'Marketing Collateral',
    slug: 'marketing-collateral',
    description: 'Business cards, brochures, and promotional materials',
    fullDescription: 'Designed comprehensive marketing materials that maintain brand consistency across all touchpoints.',
    category: 'Marketing',
    tags: ['Print Design', 'Marketing', 'Collateral'],
    image: '/images/projects/collateral.jpg',
  },
  {
    id: 6,
    title: 'Website Design Concepts',
    slug: 'website-design',
    description: 'Web design mockups and UI concepts',
    fullDescription: 'Created multiple website design concepts with focus on user experience and modern aesthetics.',
    category: 'Branding',
    tags: ['Web Design', 'UI/UX', 'Figma'],
    image: '/images/projects/website.jpg',
  },
]