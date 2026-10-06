/** @type {import('next').NextConfig} */

// Baseline security headers. No third-party origins are used at runtime:
// all fonts are self-hosted by next/font, all images are served from /public.
const securityHeaders = [
  // HSTS: two years, subdomains included. `preload` is deliberately omitted —
  // it is a one-way commitment to the preload list that should only be taken
  // once the domain and every subdomain are guaranteed HTTPS-only.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' data: blob:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "font-src 'self' data:",
      "connect-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [64, 96, 128, 200, 256, 320, 384, 420, 512],
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
