import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSiteSettings } from "@/content";
import { ogContentType, ogSize, ogStaticParams, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = ogStaticParams;

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [t, site] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getSiteSettings(locale)]);
  return renderOg({ title: t("universes"), kicker: site.series });
}
