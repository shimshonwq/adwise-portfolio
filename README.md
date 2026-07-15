# Adwise Media — Portfolio Website

A modern, fast, fully responsive portfolio for **Adwise Media** — marketing, content creation, and graphic design. Built with Next.js 15, React 19, and Tailwind CSS v4, and deployed to **Cloudflare Pages** as a static site.

## Tech stack

- **Next.js 15** (Pages Router) with **static export** (`output: 'export'`)
- **React 19**
- **Tailwind CSS v4** (CSS-first config — no `tailwind.config.js`)
- **Framer Motion** for animation
- **react-icons**

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

This generates a fully static site in the **`out/`** folder (HTML/CSS/JS). No server is required to host it.

---

## Deploy to Cloudflare Pages (from GitHub)

This project is configured for Cloudflare Pages' **"Next.js (Static HTML Export)"** preset.

1. Push this repo to GitHub (already done).
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select this repository.
4. Set the build configuration:

   | Setting                    | Value                              |
   | -------------------------- | ---------------------------------- |
   | Framework preset           | **Next.js (Static HTML Export)**   |
   | Build command              | `npm run build`                    |
   | Build output directory     | `out`                              |
   | Node version (env var)     | `NODE_VERSION` = `20`              |

   > The build output directory **must be `out`** (not `.next`). Using `.next` is the most common cause of failed Cloudflare deployments for a static Next.js site.

5. Click **Save and Deploy**.

Every push to your production branch will automatically rebuild and deploy.

### Custom domain (Cloudflare)

1. In your Pages project → **Custom domains → Set up a custom domain**.
2. Enter your domain (e.g. `adwisemedia.com`).
3. Because your domain is already on Cloudflare, DNS records are added automatically.

---

## Customizing the site

Everything is content-driven — edit these files, no component surgery needed:

- **Site info, contact, socials, stats** → `config/site.config.ts`
- **Projects / case studies** → `data/projects.ts`
- **Services** → `components/Services.tsx`
- **Colors & fonts** → `styles/globals.css` (the `@theme` block)

### Your logo

A placeholder brand mark lives at **`public/logo-mark.svg`** (and `public/favicon.svg`).
To use your own logo, replace those two files (keep the same file names). SVG is
recommended for crispness; PNG also works if you update the references in
`components/Logo.tsx` and `pages/_document.tsx`.

### Contact form

The contact form works with no backend:

- **Recommended:** create a free form at [Formspree](https://formspree.io), then set
  `NEXT_PUBLIC_FORMSPREE_ID` (in Cloudflare → Settings → Environment variables) to your form ID.
- **Fallback:** if that variable is empty, the form opens the visitor's email app
  pre-addressed to the email in `config/site.config.ts`.

See `.env.example` for details.

---

Made for Adwise Media.
