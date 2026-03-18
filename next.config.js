/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    ssr: true
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sewakhoj-final-production.up.railway.app',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
  assetPrefix: undefined,
  basePath: ''
}

module.exports = nextConfig
