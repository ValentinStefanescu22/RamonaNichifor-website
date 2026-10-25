import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { getAllSlugPairs, getSiteSettings } from "@/content";
import { ChromeShell } from "@/components/site/ChromeShell";

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [site, slugs] = await Promise.all([getSiteSettings(locale as Locale), getAllSlugPairs()]);
  return (
    <ChromeShell contacts={site.contacts} souls={site.souls} slugs={slugs}>
      {children}
    </ChromeShell>
  );
}
