import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getAbout } from "@/content";
import { ogContentType, ogSize, ogStaticParams, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = ogStaticParams;

/** „Despre mine” with her role line */
export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [t, about] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getAbout(locale)]);
  return renderOg({ title: t("about"), kicker: about.role });
}
