import { getTranslations } from "next-intl/server";
import type { UniverseFull } from "@/content/types";
import { BackPill } from "@/components/page/BackPill";
import { RichText } from "@/components/page/RichText";
import { MorphOrb, OrbArt } from "./OrbArt";

/**
 * The top of a universe page: „← Universuri” (a link typed "morph", so the hero orb flies back into its map orb), the hero orb
 * (the morph target), the name, the book title, the status badge, the hook and, when she wrote one, the longer story.
 * The hero orb is never behind a Suspense boundary, or the morph loses its pair (Task 0).
 */
export async function UniverseHero({ u, id }: { u: UniverseFull; id: string }) {
  const t = await getTranslations();
  const live = u.status === "available";
  return (
    <>
      <BackPill href="/universuri" label={t("nav.universes")} transitionTypes={["morph"]} />
      <header className="mt-8 flex flex-col items-center text-center">
        <MorphOrb id={id}>
          <OrbArt u={{ ...u, id }} size="min(64vw, 300px)" />
        </MorphOrb>
        <h1 className="display mt-7 text-[clamp(2.6rem,10vw,4.6rem)] font-[380] text-balance text-ink">{u.name}</h1>
        <p className="display mt-2 text-[1.3rem] text-ink-soft italic">{u.bookTitle}</p>
        <span
          className="mt-4 rounded-full px-3 py-1 text-[0.85rem] font-bold"
          style={live ? { background: u.tint[2], color: "var(--color-cream)" } : { background: "rgb(52 34 74 / 0.1)", color: "var(--color-ink-soft)" }}
        >
          {t(live ? "ui.bookOut" : "ui.comingSoon")}
        </span>
        <p className="mt-5 max-w-[46ch] text-[1.1rem] leading-relaxed text-ink-soft">{u.hook}</p>
        <RichText data={u.story} className="mt-5 max-w-[60ch] text-left text-[1.05rem] leading-relaxed text-ink-soft" />
      </header>
    </>
  );
}
