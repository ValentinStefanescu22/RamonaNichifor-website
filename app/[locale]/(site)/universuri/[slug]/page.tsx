import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getUniverseSlugs } from "@/content";
import { StubPage } from "@/components/site/StubPage";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

// slugs are edited in the admin: one published after the build renders on first visit (unknown ones 404 below)
export const dynamicParams = true;

const slugs = async () => await getUniverseSlugs();

export async function generateStaticParams() {
  const pairs = await slugs();
  return routing.locales.flatMap((locale) => pairs.map((p) => ({ locale, slug: p[locale] })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("universes"), robots: { index: false, follow: false } };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  if (!(await slugs()).some((p) => p[locale] === slug)) notFound();
  setRequestLocale(locale);
  return <StubPage titleKey="universes" />;
}
