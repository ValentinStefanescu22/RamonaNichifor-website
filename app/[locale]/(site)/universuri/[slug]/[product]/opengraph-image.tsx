import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getProduct, getProductPaths } from "@/content";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = async () =>
  (await getProductPaths()).flatMap((p) => routing.locales.map((locale) => ({ locale, slug: p.universe[locale], product: p.product[locale] })));

/** The keepsake's name under its universe, on the universe's tint, with its first photo when there is one */
export default async function Image({ params }: { params: Promise<{ locale: Locale; slug: string; product: string }> }) {
  const { locale, slug, product } = await params;
  const p = await getProduct(locale, slug, product);
  if (!p) notFound();
  return renderOg({ title: p.name, kicker: p.universe.name, tint: p.universe.tint, image: p.image?.src });
}
