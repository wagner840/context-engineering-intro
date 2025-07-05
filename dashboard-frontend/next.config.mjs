/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output only for production build to avoid path issues in dev
  ...(process.env.NODE_ENV === 'production' ? { output: 'standalone' } : {}),
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  images: {
    domains: ['images.unsplash.com', 'einsof7.com', 'opetmil.com'],
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Health check endpoint
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health'
      }
    ]
  }
}

export default nextConfig