import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/seo";

// Previews: nothing is crawled. Launch (SITE_INDEXABLE=1): everything but the future Payload admin and API.
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/api"];
  return isIndexable()
    ? { rules: { userAgent: "*", allow: "/", disallow }, sitemap: `${siteUrl()}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: ["/", ...disallow] } };
}
