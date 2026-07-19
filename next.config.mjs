/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a fully static site in `out/` so it deploys cleanly to
  // Cloudflare Pages (Framework preset: "Next.js (Static HTML Export)").
  output: 'export',

  reactStrictMode: true,

  // Static export has no server, so Next.js image optimization must be off.
  images: {
    unoptimized: true,
  },

  // Emit `/route/index.html` instead of `/route.html` for reliable clean URLs
  // on static hosts like Cloudflare Pages.
  trailingSlash: true,
}

export default nextConfig
