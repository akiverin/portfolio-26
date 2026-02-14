import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'standalone',
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/shared/styles')],
  },
  images: {
    qualities: [1, 25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kiver.net',
        pathname: '**',
      },
    ],
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      shared: path.resolve(__dirname, 'src/shared'),
      entities: path.resolve(__dirname, 'src/entities'),
      features: path.resolve(__dirname, 'src/features'),
      widgets: path.resolve(__dirname, 'src/widgets'),
      assets: path.resolve(__dirname, 'src/assets'),
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

export default nextConfig;
