/** @type {import('next').NextConfig} */
const isProdBuild = process.env.NODE_ENV === 'production'
const adminApiPort = process.env.ADMIN_API_PORT || '8787'

const nextConfig = {
  // Static export only for production builds (Cloudflare). Keep it off in
  // `next dev` so /api/* rewrites to the local admin API work.
  ...(isProdBuild ? { output: 'export' } : {}),

  reactStrictMode: true,

  // Static export has no server, so Next.js image optimization must be off.
  images: {
    unoptimized: true,
  },

  // Emit `/route/index.html` instead of `/route.html` for reliable clean URLs
  // on static hosts like Cloudflare Pages.
  trailingSlash: true,

  // Local admin API only — omitted from production export (worker handles /api/*).
  ...(!isProdBuild
    ? {
        async rewrites() {
          return [
            {
              source: '/api/:path*',
              destination: `http://127.0.0.1:${adminApiPort}/api/:path*`,
            },
          ]
        },
      }
    : {}),
}

export default nextConfig
