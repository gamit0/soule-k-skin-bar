import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Se agregará el dominio del bucket S3-compatible cuando exista (Fase 3+)
    remotePatterns: [],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
