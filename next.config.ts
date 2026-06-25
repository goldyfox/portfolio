import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Static export on Apache: Link prefetch triggers broken HEAD/RSC fetches.
  // SiteLink sets prefetch={false} on all internal navigation.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
