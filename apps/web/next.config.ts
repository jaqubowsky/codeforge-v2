import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@codeforge-v2/ui"],
  turbopack: {
    resolveAlias: {
      "onnxruntime-node": "./onnxruntime-stub.js",
    },
  },
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
