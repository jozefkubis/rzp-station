/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // whitelista pre tvoje Supabase avatary
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kjfjavkvgocatxssthrv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
      },
      // NOVÉ: randomuser.me portréty
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        // presne táto cesta: /api/portraits/men/XX.jpg alebo /api/portraits/women/YY.jpg
        pathname: "/api/portraits/**",
      },
    ],

    // zvyšok môže zostať, domains môžeš pokojne nechať alebo vymazať
    domains: ["upload.wikimedia.org"],

    minimumCacheTTL: 60,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
