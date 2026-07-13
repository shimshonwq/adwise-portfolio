# Adwise Portfolio - Next.js + Cloudflare

A modern, responsive portfolio website for Adwise Media - showcasing marketing, content creation, and graphic design work.

## 🚀 Features

- ⚡ Built with **Next.js 15** + **React 19**
- 🎨 Styled with **Tailwind CSS 4**
- ✨ Smooth animations with **Framer Motion**
- 📱 Fully responsive mobile-first design
- 🔍 SEO optimized
- 🎯 Contact form ready
- 🌙 Dark/Light mode support
- ☁️ Deployed on **Cloudflare Pages**

## 📋 Prerequisites

- Node.js 18+
- npm or bun
- Cloudflare account (for deployment)

## 🛠️ Local Development

### Install Dependencies
```bash
npm install
# or
bun install
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## ☁️ Deploy to Cloudflare Pages

### Option 1: Direct GitHub Integration

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Select **Create a project** > **Connect to Git**
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Node version**: 18.17.0 or higher
6. Click **Save and Deploy**

### Option 2: Wrangler CLI

```bash
npm install -g wrangler
wrangler pages deploy .next
```

## 🔗 Connect Custom Domain

1. In Cloudflare Pages dashboard
2. Go to **Settings** > **Custom domains**
3. Add your domain (e.g., yoursite.com)
4. Update your domain's DNS to point to Cloudflare
5. Done! Your site is live 🎉

## 📝 Customization

### Update Site Content
- **Hero section**: `components/Hero.tsx`
- **About section**: `components/About.tsx`
- **Contact form**: `components/Contact.tsx`
- **Projects**: `data/projects.ts`
- **Site config**: `config/site.config.ts`

### Customize Colors
Edit `tailwind.config.mjs`:

```javascript
colors: {
  primary: '#1a1a1a',      // Main brand color
  secondary: '#ff6b35',    // Accent color
  accent: '#f7931e',       // Highlight color
  light: '#f5f5f5',        // Light background
}
```

## 📊 Environment Variables

Create `.env.local` for development:

```env
NEXT_PUBLIC_EMAIL=your-email@example.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 🚀 Performance

- ✅ Image optimization
- ✅ Code splitting
- ✅ Static generation
- ✅ SEO-friendly

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## 📄 License

MIT - Feel free to use this template for your portfolio!

---

**Made with ❤️ for Adwise Media**
