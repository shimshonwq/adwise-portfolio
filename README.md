# Adwise Media — Portfolio Website

Modern portfolio for **Adwise Media** (`adwisemedia.co`) — marketing, content creation, and graphic design.

Built with Next.js 15 (static export) + Tailwind CSS v4 + Framer Motion, deployed to **Cloudflare Workers (Static Assets)**.

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

Outputs a fully static site into **`out/`**.

---

## Cloudflare deploy (important)

Your Cloudflare project runs this pipeline:

1. `npm run build` → produces `out/`
2. `npx wrangler versions upload` → uploads the Worker / assets

That is why this repo includes **`wrangler.jsonc`**, which tells Wrangler:

```jsonc
{
  "name": "adwise-portfolio",
  "assets": { "directory": "./out" }
}
```

Without that file, the **build succeeds** but **deploy fails** with:

> Missing entry-point to Worker script or to assets directory

### Dashboard settings

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy / publish command | `npx wrangler versions upload` (Cloudflare default for Workers) |
| Node version | `20` (`NODE_VERSION=20`) |

If your Cloudflare project name is **not** `adwise-portfolio`, change the `"name"` field in `wrangler.jsonc` to match the name shown in the Cloudflare dashboard.

### Custom domain

Attach `adwisemedia.co` under your Worker/Pages project → **Custom domains**.

---

## Customizing

- **Contact / domain / phone** → `config/site.config.ts`
- **Projects** → `data/projects.ts`
- **Logo** → `public/logo.png` (nav) + `public/favicon.png`
- **Tagline art** → `public/tagline.png` (optional use)
- **Colors** → `styles/globals.css` (`@theme` block)

## Contact form

The contact form emails **adwisecreativity@gmail.com** via [FormSubmit](https://formsubmit.co).

**One-time setup:** after the site is live, submit a test message once. FormSubmit will send a confirmation email to that inbox — click **Confirm** and every future submission will land in your Gmail automatically.

---

Made for Adwise Media.
