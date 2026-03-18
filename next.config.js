/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Vercel
  output: 'export',
  distDir: 'dist',
  
  // Trailing slashes for better SEO
  trailingSlash: true,
  
  // Disable strict mode for compatibility
  reactStrictMode: false,
  
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
  
  // Experimental features
  experimental: {
    // Disable features that may cause issues
    optimizeCss: false,
  },
  
  // Webpack config for additional fixes
  webpack: (config, { isServer }) => {
    // Fix for client-side only packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
