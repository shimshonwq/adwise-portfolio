import { motion } from 'framer-motion'
import { FaArrowDown } from 'react-icons/fa'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 text-primary dark:text-light">
            Think Your <span className="text-secondary">Next Thing</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            I'm a marketer, content creator, and graphic designer. I help brands tell their story through creative visuals and strategic marketing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <button className="px-8 py-4 bg-secondary text-white rounded-lg font-bold hover:bg-opacity-80 transition">
            View My Work
          </button>
          <button className="px-8 py-4 border-2 border-secondary text-secondary rounded-lg font-bold hover:bg-secondary hover:text-white transition">
            Get in Touch
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaArrowDown className="text-secondary text-3xl mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}