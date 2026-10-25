import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContactPage } from "@/content";
import { ogContentType, ogSize, ogStaticParams, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = ogStaticParams;

/** „Contact” with her tagline */
export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [t, c] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getContactPage(locale)]);
  return renderOg({ title: t("contact"), kicker: c.tagline || undefined });
}
