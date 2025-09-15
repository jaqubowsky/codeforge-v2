import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  transpilePackages: ["@codeforge-v2/ui"],
};

export default nextConfig;
