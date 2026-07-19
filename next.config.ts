import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A stray lockfile in the home directory makes Turbopack infer the wrong
  // workspace root. Pin it to this project.
  turbopack: { root: import.meta.dirname },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
