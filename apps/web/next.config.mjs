// ============================================================================
// BlackSentinel Command - Next.js Production Configuration
// Security-optimized configuration for enterprise deployment
// ============================================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================================================
  // Build Configuration
  // ============================================================================
  output: 'standalone',
  distDir: '.next',
  cleanOutputDir: true,

  // ============================================================================
  // React Configuration
  // ============================================================================
  reactStrictMode: true,

  // ============================================================================
  // Image Optimization
  // ============================================================================
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.blacksentinel.io',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // ============================================================================
  // Security Headers
  // ============================================================================
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
        {
          key: 'Cross-Origin-Resource-Policy',
          value: 'same-origin',
        },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, no-cache, must-revalidate',
        },
        {
          key: 'Pragma',
          value: 'no-cache',
        },
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],

  // ============================================================================
  // Redirects
  // ============================================================================
  redirects: async () => [
    {
      source: '/admin',
      destination: '/administration',
      permanent: true,
    },
    {
      source: '/soc',
      destination: '/operations/soc',
      permanent: true,
    },
  ],

  // ============================================================================
  // Rewrites (API Gateway pattern)
  // ============================================================================
  rewrites: async () => [
    {
      source: '/api/v1/:path*',
      destination: '/api/:path*',
    },
  ],

  // ============================================================================
  // Webpack Configuration
  // ============================================================================
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Security: Remove source maps in production
    if (process.env.NODE_ENV === 'production') {
      config.devtool = false;
    }

    return config;
  },

  // ============================================================================
  // Experimental Features
  // ============================================================================
  experimental: {
    // Enable Server Actions
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Optimize CSS
    optimizeCss: true,
  },

  // ============================================================================
  // Compiler Options
  // ============================================================================
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // ============================================================================
  // Environment Variables Validation
  // ============================================================================
  env: {
    APP_VERSION: process.env.APP_VERSION || '1.0.0',
    BUILD_TIME: new Date().toISOString(),
  },
};

export default nextConfig;
