import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.cto.new",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.cto.new",
        port: "",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_ANALYTICS_WRITE_KEY:
      process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY ?? "",
    NEXT_PUBLIC_ANALYTICS_DATASET:
      process.env.NEXT_PUBLIC_ANALYTICS_DATASET ?? "",
    API_BASE_URL: process.env.API_BASE_URL ?? "",
  },
};

export default nextConfig;
