import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@codeforge-v2/ui"],
  serverExternalPackages: [
    "@xenova/transformers",
    "onnxruntime-web",
    "onnxruntime-node",
  ],
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
