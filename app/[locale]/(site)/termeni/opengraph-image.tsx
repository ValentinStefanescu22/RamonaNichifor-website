import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ogContentType, ogSize, ogStaticParams, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = ogStaticParams;

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return renderOg({ title: t("terms") });
}
