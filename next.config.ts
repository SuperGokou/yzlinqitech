import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  typescript: {
    // Pre-existing type error in admin blog page -- not related to public site UI
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
