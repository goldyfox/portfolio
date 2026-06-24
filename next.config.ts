import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Static HTML for DreamHost shared hosting (no Node.js).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
