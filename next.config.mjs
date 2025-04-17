/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // ✅ Nastavenie maximálnej veľkosti request body na 5MB
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kjfjavkvgocatxssthrv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
      },
    ],
    minimumCacheTTL: 60, // ✅ Ukladanie do cache na 60 sekúnd
    formats: ["image/avif", "image/webp"], // ✅ Automaticky používa WebP a AVIF
    deviceSizes: [320, 420, 768, 1024, 1200], // ✅ Optimalizované veľkosti pre zariadenia
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // ✅ Optimalizované veľkosti obrázkov
  },
};

export default nextConfig;
