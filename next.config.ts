import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Allow external image hosts used in the app (e.g. Unsplash)
   * This fixes runtime errors from `next/image` when loading external images.
   */
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
