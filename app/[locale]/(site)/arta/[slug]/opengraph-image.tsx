import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getArtwork, getSlugPairs } from "@/content";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = async () => (await getSlugPairs("artworks")).flatMap((p) => routing.locales.map((locale) => ({ locale, slug: p[locale] })));

/** The title with the work itself, whole */
export default async function Image({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const [t, work] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getArtwork(locale, slug)]);
  if (!work) notFound();
  return renderOg({ title: work.title, kicker: t("art"), image: work.images[0]?.src });
}
