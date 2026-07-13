/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  swcMinify: true,
  reactStrictMode: true,
}

module.exports = nextConfig