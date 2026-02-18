import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Adicionando permissão para o Bunny.net
      {
        protocol: 'https',
        hostname: 'vz-7cffe64a-76f.b-cdn.net',
      },
      // Adicionando permissão para o Supabase
      {
        protocol: 'https',
        hostname: 'ltvqklvtoufhracpwmor.supabase.co',
      },
    ],
  },
};

export default nextConfig;