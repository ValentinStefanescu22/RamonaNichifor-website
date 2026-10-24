import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImage, pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { getCounsellingPage, getFeaturedBook, getHomeArtworks, getSiteSettings, getUniverses } from "@/content";
import { AboutTeaser } from "@/components/poiana/AboutTeaser";
import { ArtTeaser } from "@/components/poiana/ArtTeaser";
import { CounsellingTeaser } from "@/components/poiana/CounsellingTeaser";
import { FeaturedBook } from "@/components/poiana/FeaturedBook";
import { HomeFlightZone } from "@/components/poiana/HomeFlightZone";

// The home owns its canonical + hreflang (the layout only sets site-wide defaults).
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("homeTitle");
  return pageMetadata({ locale, href: "/", title, description: t("description"), image: ogImage(locale, title) });
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [site, universes, book, artworks, counselling] = await Promise.all([
    getSiteSettings(locale),
    getUniverses(locale),
    getFeaturedBook(locale),
    getHomeArtworks(locale),
    getCounsellingPage(locale),
  ]);
  return (
    <main>
      {/* Hero, paths and universes share one zone: the butterfly flies through it and lands in the Fluture window */}
      <HomeFlightZone site={site} universes={universes} />
      <FeaturedBook book={book} site={site} />
      <AboutTeaser site={site} />
      <ArtTeaser artworks={artworks} />
      <CounsellingTeaser site={site} counselling={counselling} />
    </main>
  );
}
