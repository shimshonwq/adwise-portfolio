import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'

const categories = ['All', 'Logo Design', 'Marketing', 'Content', 'Branding']

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section id="portfolio" className="py-20 px-4 bg-light dark:bg-primary/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold font-heading mb-12 text-center text-primary dark:text-light">
          Featured Work
        </h2>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                activeCategory === cat
                  ? 'bg-secondary text-white'
                  : 'bg-white dark:bg-primary text-primary dark:text-light border border-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/projects/${project.slug}`}>
                <div className="group cursor-pointer h-80 relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition bg-gray-200 dark:bg-gray-700">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      [Project Image]
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-6">
                    <div>
                      <h3 className="text-white text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-200 text-sm">{project.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}