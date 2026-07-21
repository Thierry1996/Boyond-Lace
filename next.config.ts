import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The floating dev-tools badge sits over the bottom-left of every page and
  // gets in the way of reviewing layout. It is dev-only and never shipped, but
  // it should not be in the way while the design is being judged.
  devIndicators: false,
  // A stray lockfile in the home directory makes Turbopack infer the wrong
  // workspace root. Pin it to this project.
  turbopack: { root: import.meta.dirname },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
