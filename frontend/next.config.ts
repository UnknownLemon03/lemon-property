import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: process.env.NEXT_PUBLIC_URL,
        basePath: false,
      },
    ]
  },
};
export default nextConfig;
