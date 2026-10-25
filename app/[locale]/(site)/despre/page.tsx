import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getAbout, getSiteSettings } from "@/content";
import { breadcrumbLd, pageMetadata, profilePageLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { Beat } from "@/components/about/Beat";
import { Crafts } from "@/components/about/Crafts";
import { Portrait } from "@/components/about/Portrait";
import { Signature } from "@/components/about/Signature";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, site, about] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getSiteSettings(locale), getAbout(locale)]);
  return pageMetadata({ locale, path: "/despre", title: t("about"), description: `${site.intro} ${about.role}` });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, site, about] = await Promise.all([getTranslations(), getSiteSettings(locale), getAbout(locale)]);

  return (
    <main>
      <JsonLd data={breadcrumbLd(locale, [{ name: t("nav.about"), path: "/despre" }])} />
      <JsonLd data={profilePageLd(site, locale)} />
      <PageHero
        tone="lilac"
        title={about.titleA}
        titleItalic={about.titleB}
        lead={<p className="display text-[clamp(1.35rem,4.6vw,1.8rem)] leading-[1.25] font-[360] text-ink">{site.intro}</p>}
        aside={<Portrait portrait={about.portrait ?? site.portrait} />}
      >
        <p className="max-w-[40ch] text-[1.02rem] text-ink-soft">{about.role}</p>
      </PageHero>

      {/* her story, in her movements: the words are hers, the breath between them is the layout */}
      <section className="bg-cream px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
          <h2 className="display text-[clamp(2.2rem,8.5vw,3.8rem)] font-[380] text-ink lg:sticky lg:top-28 lg:self-start">{t("ui.myStory")}</h2>
          <div className="max-w-[58ch] text-[1.08rem] leading-[1.65] text-ink">
            {about.story.map((movement, m) => (
              <div key={m} data-movement className={`space-y-5 ${m > 0 ? "mt-16 lg:mt-20" : ""}`}>
                {movement.map((beat, i) => (
                  <Beat key={i} kind={beat.kind} text={beat.text} i={i} />
                ))}
              </div>
            ))}
            <Signature name={site.name.split(" ")[0]} />
          </div>
        </div>
      </section>

      <Crafts crafts={about.crafts} findMe={t("about.findMe")} sameAs={site.sameAs} />
    </main>
  );
}
