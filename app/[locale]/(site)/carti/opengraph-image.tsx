import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getBooks, getSiteSettings } from "@/content";
import { ogContentType, ogSize, ogStaticParams, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = ogStaticParams;

/** „Cărți” with the front cover of the first book that is out */
export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [t, site, books] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getSiteSettings(locale), getBooks(locale)]);
  return renderOg({ title: t("books"), kicker: site.series, image: (books.find((b) => b.status === "published") ?? books[0])?.cover.src });
}
