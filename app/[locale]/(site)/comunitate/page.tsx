import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCommunity, getSiteSettings } from "@/content";
import { breadcrumbLd, eventLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { Reveal } from "@/components/page/Reveal";
import { SectionTitle } from "@/components/page/SectionTitle";
import { Instagram } from "@/components/ui/icons";
import { PillLink, TextLink } from "@/components/ui/links";
import { Events } from "@/components/community/Events";
import { GatheringCircle } from "@/components/community/GatheringCircle";
import { Partners } from "@/components/community/Partners";
import { Projects } from "@/components/community/Projects";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = await getCommunity(locale);
  return pageMetadata({ locale, path: "/comunitate", title: `${c.titleA} ${c.titleB}`, description: c.lead });
}

const contact = { pathname: "/contact", query: { subiect: "comunitate" } } as const;

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, site, c] = await Promise.all([getTranslations(), getSiteSettings(locale), getCommunity(locale)]);
  const upcoming = c.events.flatMap((e) => (e.startsAt && e.timing === "upcoming" ? [{ ...e, startsAt: e.startsAt }] : []));

  return (
    <main>
      <JsonLd data={breadcrumbLd(locale, [{ name: t("nav.community"), path: "/comunitate" }])} />
      {upcoming.map((e) => (
        <JsonLd key={e.id} data={eventLd(locale, site, e)} />
      ))}
      <PageHero tone="petal" title={c.titleA} titleItalic={c.titleB} tagline={c.tagline} lead={<p>{c.lead}</p>} aside={<GatheringCircle />} />

      {/* what the community is, in her words: one calm paragraph before the sections it describes */}
      <section className="px-4 pt-6 pb-16 sm:px-6 lg:pb-20" style={{ background: "linear-gradient(180deg, #e4ecf6 0%, var(--color-cream) 70%)" }}>
        <Reveal className="mx-auto max-w-6xl">
          <p className="max-w-[58ch] text-[clamp(1.12rem,2.6vw,1.3rem)] leading-[1.65] text-ink">{c.intro}</p>
        </Reveal>
      </section>

      <section className="bg-cream px-4 pt-4 pb-20 sm:px-6 lg:pb-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle lead={c.eventsLead}>{c.eventsTitle}</SectionTitle>
          <Events events={c.events} />
        </div>
      </section>

      <section className="bg-cream px-4 pb-24 sm:px-6 lg:pb-32">
        <div className="mx-auto max-w-6xl">
          <SectionTitle lead={c.projectsLead}>{c.projectsTitle}</SectionTitle>
          <Projects projects={c.projects} />
        </div>
      </section>

      <section className="bg-cream px-4 pb-24 sm:px-6 lg:pb-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            lead={
              <div className="space-y-3">
                {c.partnersLead.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
            }
          >
            {c.partnersTitle}
          </SectionTitle>
          <Partners partners={c.partners} />
          <TextLink href={contact} className="mt-6">
            {t("community.partnerInvite")}
          </TextLink>
        </div>
      </section>

      <section className="px-4 pt-16 pb-6 sm:px-6" style={{ background: "linear-gradient(180deg, var(--color-cream) 0%, var(--color-petal) 100%)" }}>
        <div className="mx-auto max-w-6xl">
          {/* her closing words, then the welcome */}
          <Reveal>
            <p className="max-w-[58ch] text-[clamp(1.12rem,2.6vw,1.3rem)] leading-[1.65] text-ink">{c.closing}</p>
          </Reveal>
          <Reveal i={1} className="mt-6 mb-20 lg:mb-24">
            <p className="display text-[clamp(1.9rem,6.5vw,3rem)] leading-[1.1] font-[360] text-balance text-violet italic">{t("community.welcome")}</p>
          </Reveal>
          <SectionTitle lead={c.ctaLine}>{c.ctaTitle}</SectionTitle>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <PillLink href={site.contacts.instagram.href} external icon={<Instagram size={18} />}>
              {t("community.follow")}
            </PillLink>
            <TextLink href={contact}>{t("community.propose")}</TextLink>
          </div>
        </div>
      </section>
    </main>
  );
}
