import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCounselling } from "@/content";
import { ogContentType, ogSize, ogStaticParams, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = ogStaticParams;

/** „Consiliere” with its tagline */
export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [t, c] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getCounselling(locale)]);
  return renderOg({ title: t("counselling"), kicker: c.tagline });
}
