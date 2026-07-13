# Adwise Portfolio - Next.js

A modern, responsive portfolio website for Adwise Media - showcasing marketing, content creation, and graphic design work.

## 🚀 Features

- ⚡ Built with **Next.js 14** + **React 18**
- 🎨 Styled with **Tailwind CSS**
- ✨ Smooth animations with **Framer Motion**
- 📱 Fully responsive mobile-first design
- 🔍 SEO optimized
- 🎯 Contact form integration
- 🌙 Dark/Light mode ready
- 📊 Analytics ready

## 📁 Project Structure

```
adwise-portfolio/
├── pages/               # Next.js pages/routes
├── components/          # Reusable React components
├── public/              # Static assets
├── styles/              # Global styles
├── data/                # Portfolio data & content
├── lib/                 # Utility functions
└── config/              # Configuration files
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/shimshonwq/adwise-portfolio.git
cd adwise-portfolio

# Install dependencies
npm install

# Create .env.local from example
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Customization

1. **Update Colors**: Edit `tailwind.config.js`
2. **Add Projects**: Update `data/projects.ts`
3. **Modify Content**: Edit component files in `components/`
4. **Configure Domain**: Update `config/site.config.ts`

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure environment variables
5. Deploy!

### Connect Custom Domain (Cloudflare)

1. In Vercel dashboard, go to Settings > Domains
2. Add your domain from Cloudflare
3. Update Cloudflare nameservers if needed

## 📞 Contact Form Setup

For contact form functionality:

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Add the form ID to `.env.local`

## 📊 Analytics Setup

1. Set up Google Analytics
2. Add your GA ID to `.env.local`
3. Analytics will be tracked automatically

## 🎨 Customizing Brand Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#1a1a1a',      // Main brand color
  secondary: '#ff6b35',    // Accent color
  accent: '#f7931e',       // Highlight color
  light: '#f5f5f5',        // Light background
}
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)

## 📄 License

MIT - Feel free to use this template for your portfolio!

## 🤝 Support

For questions or issues, please open an issue on GitHub.

---

**Made with ❤️ for Adwise Media**