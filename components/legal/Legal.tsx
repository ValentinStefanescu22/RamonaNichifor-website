import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getLegal } from "@/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { RichText } from "@/components/page/RichText";

// Confidențialitate and Termeni (spec §5.9): one CMS doc each (legal-pages), her own text, the date she last changed it
const pages = { privacy: { path: "/confidentialitate", nav: "privacy" }, terms: { path: "/termeni", nav: "terms" } } as const;
type Kind = keyof typeof pages;

export async function legalMetadata(locale: Locale, kind: Kind): Promise<Metadata> {
  const t = await getTranslations({ locale });
  return pageMetadata({ locale, path: pages[kind].path, title: t(`nav.${pages[kind].nav}`), description: t(`legal.${kind}Description`) });
}

export async function Legal({ locale, kind }: { locale: Locale; kind: Kind }) {
  const [t, doc] = await Promise.all([getTranslations(), getLegal(locale, kind)]);
  const title = t(`nav.${pages[kind].nav}`);
  const date = doc?.lastUpdated && new Date(doc.lastUpdated);
  return (
    <main>
      <JsonLd data={breadcrumbLd(locale, [{ name: title, path: pages[kind].path }])} />
      <PageHero
        tone="cream"
        title={title}
        bottom="pb-8 lg:pb-12"
        lead={
          date ? (
            <p>
              <time dateTime={doc.lastUpdated!}>
                {t("legal.lastUpdated", { date: new Intl.DateTimeFormat(locale === "ro" ? "ro-RO" : "en-GB", { dateStyle: "long", timeZone: "Europe/Bucharest" }).format(date) })}
              </time>
            </p>
          ) : undefined
        }
      />
      <section className="bg-cream px-4 pb-20 sm:px-6 lg:pb-28">
        <div className="mx-auto max-w-[75rem]">
          {doc?.body ? (
            <RichText data={doc.body} className="max-w-[64ch] space-y-4 text-[1.06rem] leading-[1.7] text-ink" />
          ) : (
            <p className="text-[1.06rem] text-ink-soft">{t("ui.comingSoon")}</p>
          )}
        </div>
      </section>
    </main>
  );
}
