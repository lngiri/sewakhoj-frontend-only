/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
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
