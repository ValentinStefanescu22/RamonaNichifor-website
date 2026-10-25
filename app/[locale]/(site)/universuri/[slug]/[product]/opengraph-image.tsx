import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getProduct, getProductPaths } from "@/content";
import { byNumber } from "@/components/product/images";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = async () =>
  (await getProductPaths()).flatMap((p) => routing.locales.map((locale) => ({ locale, slug: p.universe[locale], product: p.product[locale] })));

/** The keepsake's name under its universe, on the universe's tint, with its main photo when there is one */
export default async function Image({ params }: { params: Promise<{ locale: Locale; slug: string; product: string }> }) {
  const { locale, slug, product } = await params;
  const p = await getProduct(locale, slug, product);
  if (!p) notFound();
  // the deck's winning card / the first bookmark by file number, like the page, so reordering photos in the admin keeps the card
  const image = (p.gallery ? byNumber(p.images, 1) : undefined) ?? p.images[0];
  return renderOg({ title: p.name, kicker: p.universe.name, tint: p.universe.tint, image: image?.src });
}
