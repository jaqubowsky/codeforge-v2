import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@codeforge-v2/ui"],
  serverExternalPackages: ["@xenova/transformers"],
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
