import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCounselling, getSiteSettings } from "@/content";
import { breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { ArrowDown } from "@/components/ui/icons";
import { PillLink, TextLink } from "@/components/ui/links";
import { BookingSoon } from "@/components/counselling/BookingSoon";
import { Faq } from "@/components/counselling/Faq";
import { Formats } from "@/components/counselling/Formats";
import { Patterns } from "@/components/counselling/Patterns";
import { RightForYou } from "@/components/counselling/RightForYou";
import { Steps } from "@/components/counselling/Steps";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, c] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getCounselling(locale)]);
  return pageMetadata({ locale, path: "/consiliere", title: t("counselling"), description: c.teaserLead });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, site, c] = await Promise.all([getTranslations(), getSiteSettings(locale), getCounselling(locale)]);
  const whatsapp = site.contacts.whatsapp.href;
  const faq = c.faq.flatMap((f) => (f.answer ? [{ question: f.question, answer: f.answer }] : []));

  return (
    <main>
      <JsonLd data={breadcrumbLd(locale, [{ name: t("nav.counselling"), path: "/consiliere" }])} />
      {faq.length > 0 && <JsonLd data={faqLd(faq)} />}
      <PageHero tone="sage" title={t("nav.counselling")} tagline={c.tagline} lead={<p>{c.teaserTitle}</p>} aside={<Formats formats={c.formats} sessions={c.sessions} />}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <PillLink href="#programare" icon={<ArrowDown size={18} />}>
            {t("counselling.book")}
          </PillLink>
          <TextLink href={whatsapp} external>
            {t("counselling.whatsapp")}
          </TextLink>
        </div>
      </PageHero>

      <Patterns patterns={c.patterns} whatsapp={whatsapp} />
      <RightForYou rightForYou={c.rightForYou} />
      <Steps steps={c.steps} />
      <BookingSoon whatsapp={whatsapp} />
      <Faq items={faq} />

      {c.ctaTitle && (
        <section className="px-4 pb-8 sm:px-6" style={{ background: "#eef2e8" }}>
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 rounded-[2rem] bg-sage px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="display max-w-[18ch] text-[clamp(1.6rem,6vw,2.6rem)] leading-[1.12] font-[360] text-ink">{c.ctaTitle}</h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <PillLink href="#programare" icon={<ArrowDown size={18} className="rotate-180" />}>
                {t("counselling.book")}
              </PillLink>
              <TextLink href={whatsapp} external>
                {t("counselling.whatsapp")}
              </TextLink>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
