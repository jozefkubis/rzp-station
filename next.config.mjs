/** @type {import('next').NextConfig} */

// CSP podľa prostredia
function makeCSP(isDev) {
  const base = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https: data: blob:",
    "font-src 'self' data:",
    // sieťové volania (Supabase + Vercel web vitals + Open-Meteo)
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com https://api.open-meteo.com",
    // workers (RSC/refresh)
    "worker-src 'self' blob:",
  ];

  if (isDev) {
    base.push(
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:",
      "connect-src 'self' http://localhost:3000 ws://localhost:3000 https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com https://api.open-meteo.com",
    );
  } else {
    // >>> TU JE ZMENA – povolené 'unsafe-inline' pre produkciu
    base.push("script-src 'self' 'unsafe-inline'");
  }

  return base.join("; ");
}

const securityHeaders = (isDev) => [
  {
    key: "Strict-Transport-Security",
    value: "max-age=15552000; includeSubDomains",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Content-Security-Policy", value: makeCSP(isDev) },
];

const isDev = process.env.NODE_ENV !== "production";

const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders(isDev) }];
  },
  images: {
    unoptimized: true, // OK, môže zostať
    remotePatterns: [
      // Supabase Storage – PUBLIC objekty
      {
        protocol: "https",
        hostname: "kjfjavkvgocatxssthrv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Supabase Storage – SIGNED (privátne objekty)
      {
        protocol: "https",
        hostname: "kjfjavkvgocatxssthrv.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },

      // tvoje ďalšie zdroje
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/portraits/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 60,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
