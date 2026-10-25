import type { Locale } from "@/i18n/routing";
import { getCommunity } from "@/content";
import { ogContentType, ogSize, ogStaticParams, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const generateStaticParams = ogStaticParams;

/** „Comunitate cu sens” with its tagline */
export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const c = await getCommunity(locale);
  return renderOg({ title: `${c.titleA} ${c.titleB}`, kicker: c.tagline });
}
