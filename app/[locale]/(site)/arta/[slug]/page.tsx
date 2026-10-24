import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { StubPage } from "@/components/site/StubPage";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamicParams = false;

// no artwork pages yet (M3): every /arta/<slug> is a 404 until then
const slugs = async (): Promise<Record<Locale, string>[]> => [];

export async function generateStaticParams() {
  const pairs = await slugs();
  return routing.locales.flatMap((locale) => pairs.map((p) => ({ locale, slug: p[locale] })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("art"), robots: { index: false, follow: false } };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  if (!(await slugs()).some((p) => p[locale] === slug)) notFound();
  setRequestLocale(locale);
  return <StubPage titleKey="art" />;
}
