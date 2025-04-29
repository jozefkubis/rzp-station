/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // whitelist pre tvoje externé obrázky
    remotePatterns: [
      // Supabase úložisko
      {
        protocol: "https",
        hostname: "kjfjavkvgocatxssthrv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
      },
      // randomuser.me portréty
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/api/portraits/**",
      },
      // wikimedia (ak ešte potrebuješ nejaké staré URL)
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
    ],
    // nepoužívaj už `domains` – je to deprecated
    minimumCacheTTL: 60,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;
