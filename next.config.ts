import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
};

export default withPayload(createNextIntlPlugin()(nextConfig));
