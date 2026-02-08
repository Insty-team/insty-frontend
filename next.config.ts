import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev.insty.ai.kr',
      },
      {
        protocol: 'https',
        hostname: 'insty.ai.kr',
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: '/api/v1/ai/:path*',
        destination: process.env.NEXT_PUBLIC_BACK_AI_URL + '/:path*',
      },
      {
        source: '/api/v1/:path*',
        destination: process.env.NEXT_PUBLIC_BACK_BASE_URL + '/:path*',
      },
    ];
  },
};

export default nextConfig;
