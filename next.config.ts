import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  images: {
    domains: [], // Add external image domains as needed
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb", // Increase for file uploads
    },
    optimizeCss: true,
    // typedRoutes: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Performance optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression

  // Build optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production

  async redirects() {
    return [];
  },

  async rewrites() {
    return [];
  },
};

// Bundle analyzer configuration
// Only apply when ANALYZE is set to avoid conflicts with Turbopack
const config =
  process.env.ANALYZE === "true"
    ? bundleAnalyzer({ enabled: true })(nextConfig)
    : nextConfig;

export default config;
