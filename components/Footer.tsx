export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-light py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold font-heading mb-4 text-secondary">ADWISE</h3>
            <p className="text-gray-400">Marketing, Content Creation & Graphic Design</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#portfolio" className="hover:text-secondary transition">Portfolio</a></li>
              <li><a href="#about" className="hover:text-secondary transition">About</a></li>
              <li><a href="#contact" className="hover:text-secondary transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Get in Touch</h4>
            <p className="text-gray-400">Email: your-email@example.com</p>
            <p className="text-gray-400">Available for new projects</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Adwise Media. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}