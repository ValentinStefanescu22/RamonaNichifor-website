import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
};

export default createNextIntlPlugin()(nextConfig);
