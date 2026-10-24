import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { languageAlternates } from "@/lib/seo";

// Inner pages join in M3 when they stop being stubs; lastModified then comes from Payload.
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = languageAlternates("/");
  const lastModified = new Date();
  return routing.locales.map((l) => ({ url: languages[l], lastModified, alternates: { languages } }));
}
