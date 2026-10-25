import { getTranslations } from "next-intl/server";
import { PageHero, type HeroTone } from "@/components/page/PageHero";
import { StatusChip } from "@/components/ui/StatusChip";

export type StubKey = "universes" | "books" | "art" | "counselling" | "about" | "community" | "contact" | "privacy" | "terms";

const toneOf: Record<StubKey, HeroTone> = {
  universes: "sky",
  books: "petal",
  community: "petal",
  counselling: "sage",
  about: "lilac",
  art: "mist",
  contact: "mist",
  privacy: "cream",
  terms: "cream",
};

/** A page that is still being built (M3): the inner-page opener with the page's name and a plain „În curând”. */
export async function StubPage({ titleKey }: { titleKey: StubKey }) {
  const t = await getTranslations();
  return (
    <main>
      <PageHero
        title={t(`nav.${titleKey}`)}
        tone={toneOf[titleKey]}
        bottom="pb-24 lg:pb-32"
        lead={
          <span className="flex flex-wrap items-center gap-2.5">
            <StatusChip>{t("ui.comingSoon")}</StatusChip>
            {t("stub.line")}
          </span>
        }
      />
    </main>
  );
}
