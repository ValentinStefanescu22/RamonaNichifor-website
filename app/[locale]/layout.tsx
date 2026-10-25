import type { ReactNode } from "react";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/content";
import { baseMetadata, siteGraph } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArtGuard } from "@/components/ui/ArtGuard";
import { MotionRoot } from "@/components/ui/MotionRoot";
import { PaintDefs } from "@/components/poiana/PaintDefs";
import { LivePreviewRefresh } from "@/components/site/LivePreviewRefresh";
import { alegreya, fraunces, parisienne } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Site-wide defaults only: title template, description, metadataBase, robots, Open Graph/Twitter card.
// canonical + hreflang are per page (the home sets them in (site)/page.tsx via pageMetadata): Next merges
// metadata shallowly, so alternates set here would leak the home canonical onto every inner page.
// Icons come from app/icon.png and app/apple-icon.png.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return baseMetadata({ locale, title: t("homeTitle"), description: t("description") });
}

export const viewport = { themeColor: "#DCE8F4", viewportFit: "cover" };

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [site, draft] = await Promise.all([getSiteSettings(locale), draftMode()]);
  return (
    <html lang={locale} data-theme="light" data-scroll-behavior="smooth" className={`${fraunces.variable} ${alegreya.variable} ${parisienne.variable}`}>
      <body>
        <JsonLd data={siteGraph(site, locale)} />
        {draft.isEnabled && <LivePreviewRefresh />}
        <NextIntlClientProvider>
          <MotionRoot>
            <PaintDefs />
            <ArtGuard />
            {children}
          </MotionRoot>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
