/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use default .next output directory for Vercel
  // (No distDir specified - defaults to .next)
  
  // Trailing slashes for better SEO
  trailingSlash: true,
  
  // ESLint and TypeScript - ignore errors during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization settings
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
