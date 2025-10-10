/** @type {import('next').NextConfig} */

// 1) Bezpečnostné hlavičky (jednoduché, ale užitočné)
const securityHeaders = [
  // Vynútime HTTPS v prehliadači (HSTS)
  { key: 'Strict-Transport-Security', value: 'max-age=15552000; includeSubDomains' },

  // Zákaz vkladania appky do <iframe> (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },

  // Prehliadač nech „neuhádne“ typ súboru
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Menej info v Referer hlavičke
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // Zakážeme kameru/mikrofón/geolokáciu (nepoužívaš)
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },

  // Izolácia okien (pevnejšie sandboxovanie)
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },

  // Content Security Policy – odkiaľ smie appka načítavať obsah
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https: data: blob:",
      "font-src 'self' data:",
      // dôležité: volania na Supabase + Vercel analytics
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com",
    ].join('; ')
  },
];

const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },

  // 2) Nastavíme hlavičky pre všetky routy
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },

  // 3) Tvoje pôvodné nastavenia obrázkov (nechávam bez zmeny)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kjfjavkvgocatxssthrv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/avatars/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // už žiadne `domains: [...]`
  },
};

export default nextConfig;
