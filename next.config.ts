import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/ghlindiaventurescom/blog',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xktbkmadjhynualgrbeb.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
