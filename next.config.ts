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
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_BACK_BASE_URL + '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
