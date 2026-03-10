import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@codeforge-v2/ui"],
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-web"],
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
