import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["playwright-core"],
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/logos/vsetut-logo-new.png",
      },
    ];
  },
};

export default nextConfig;
