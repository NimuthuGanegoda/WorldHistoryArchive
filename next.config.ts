import type { NextConfig } from "next";

// Security headers configuration
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

const nextConfig: NextConfig = {
  output: 'export',
  // Remove basePath for custom domain
  // basePath: '',
  // Optionally set assetPrefix if you use a CDN or want to ensure static assets load from the root
  // assetPrefix: '',
  images: {
    unoptimized: true,
  },
  
  // Security headers (applied during dev, but note: static export won't include these)
  // For production, configure these on your hosting platform (GitHub Pages, Netlify, etc.)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
