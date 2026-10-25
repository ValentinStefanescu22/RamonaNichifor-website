import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getArtworks } from "@/content";
import { ogContentType, ogSize, ogStaticParams, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = ogStaticParams;

/** „Artă” with the first work, drawn whole */
export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [t, works] = await Promise.all([getTranslations({ locale }), getArtworks(locale)]);
  return renderOg({ title: t("nav.art"), kicker: t("art.tagline"), image: works[0]?.images[0]?.src });
}
