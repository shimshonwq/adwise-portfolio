import { motion } from 'framer-motion'

export default function About() {
  const skills = [
    'Brand Strategy',
    'Logo Design',
    'Content Creation',
    'Social Media Marketing',
    'Graphic Design',
    'Campaign Strategy',
  ]

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold font-heading mb-12 text-center text-primary dark:text-light">
          About Me
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              I'm passionate about creating meaningful visual experiences and building brands that resonate with audiences. With expertise in marketing, content creation, and graphic design, I help businesses stand out in a crowded market.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              My approach combines strategic thinking with creative execution. Whether it's crafting a compelling brand identity, developing marketing campaigns, or creating engaging content, I focus on delivering results that matter.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-primary dark:text-light">Skills & Expertise</h3>
            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-4 bg-light dark:bg-primary/50 rounded-lg border-l-4 border-secondary"
                >
                  <p className="font-semibold text-primary dark:text-light">{skill}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}