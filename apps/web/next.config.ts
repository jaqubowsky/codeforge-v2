import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@codeforge-v2/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgproxy.justjoinit.tech",
      },
    ],
  },
};

export default nextConfig;
