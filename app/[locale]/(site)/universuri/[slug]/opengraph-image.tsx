import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getSlugPairs, getUniverse } from "@/content";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = async () => (await getSlugPairs("universes")).flatMap((p) => routing.locales.map((locale) => ({ locale, slug: p[locale] })));

/** The universe's name on its own tint, with the front cover of its book once it is out */
export default async function Image({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const [t, u] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getUniverse(locale, slug)]);
  if (!u) notFound();
  const book = u.books.find((b) => b.status === "published");
  return renderOg({ title: u.name, kicker: t("universes"), tint: u.tint, image: book?.cover.src });
}
