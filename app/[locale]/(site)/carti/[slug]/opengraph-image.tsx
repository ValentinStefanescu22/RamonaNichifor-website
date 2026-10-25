import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getBook, getSlugPairs, getUniverses } from "@/content";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = async () => (await getSlugPairs("books")).flatMap((p) => routing.locales.map((locale) => ({ locale, slug: p[locale] })));

/** The title on its universe's tint, with the front cover (never the back cover, which prints the welcome line) */
export default async function Image({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const [t, book, universes] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getBook(locale, slug), getUniverses(locale)]);
  if (!book) notFound();
  return renderOg({ title: book.title, kicker: t("books"), tint: universes.find((u) => u.slug === book.universeSlug)?.tint, image: book.cover.src });
}
