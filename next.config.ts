import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Enable gzip/brotli compression for all responses
  compress: true,
  // Optimize images: serve WebP/AVIF, cache for 1 year
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Set long-lived cache headers for static assets
  async headers() {
    if (process.env.NODE_ENV === "development") {
      return [];
    }
    return [
      {
        // Cache static assets (JS, CSS, fonts, images in /_next/) for 1 year
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache public images/fonts for 30 days
        source: "/:path*(.+\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff|woff2|ttf)$)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        // Cache API responses that are read-only for 5 minutes
        source: "/api/badge-rules",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=60" },
        ],
      },
    ];
  },
  // Reduce the size of server-side bundles
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;

