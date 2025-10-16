import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
