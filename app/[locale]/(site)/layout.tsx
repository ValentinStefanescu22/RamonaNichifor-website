import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { getBookSlugs, getSiteSettings, getUniverseSlugs } from "@/content";
import { ChromeShell } from "@/components/site/ChromeShell";

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [site, universes, books] = await Promise.all([getSiteSettings(locale as Locale), getUniverseSlugs(), getBookSlugs()]);
  return (
    <ChromeShell contacts={site.contacts} souls={site.souls} slugs={{ universes, books }}>
      {children}
    </ChromeShell>
  );
}
