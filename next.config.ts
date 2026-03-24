import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // experimental: {
  //   workerThreads: true,
  // },
  // Disable React Strict Mode to reduce dev warnings
  reactStrictMode: false,
};

export default nextConfig;
