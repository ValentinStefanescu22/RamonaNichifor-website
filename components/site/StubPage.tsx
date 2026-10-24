import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { StatusChip } from "@/components/ui/StatusChip";

export type StubKey = "universes" | "books" | "art" | "counselling" | "about" | "community" | "contact" | "privacy" | "terms";
type Tone = "petal" | "sage" | "lilac" | "mist" | "sky" | "cream";

// Each opener tints the sky toward the page's own colour and ends on the colour its footer starts from (ChromeShell groundOf).
const tones: Record<Tone, string> = {
  petal: "linear-gradient(180deg, #f9e8ef 0%, var(--color-petal) 46%, var(--color-cream) 96%)",
  sage: "linear-gradient(180deg, #e9efe2 0%, var(--color-sage) 60%, #eef2e8 100%)",
  lilac: "linear-gradient(180deg, #ece4f6 0%, #f4eef6 40%, var(--color-cream) 78%)",
  mist: "linear-gradient(180deg, #e2ecf7 0%, var(--color-mist) 60%)",
  sky: "radial-gradient(90% 45% at 88% 6%, rgb(255 255 255 / 0.55), transparent 62%), radial-gradient(80% 40% at 8% 42%, rgb(201 184 230 / 0.35), transparent 68%), linear-gradient(180deg, #cddff1 0%, #e1eaf6 26%, #ece6f5 54%, #f6e2ea 80%, var(--color-cream) 100%)",
  cream: "linear-gradient(180deg, var(--color-mist) 0%, var(--color-cream) 70%)",
};

const toneOf: Record<StubKey, Tone> = {
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

const wash = "radial-gradient(ellipse 60% 55% at 70% 40%, #000 30%, transparent 100%)";
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** A page that is still being built (M3): the inner-page opener with the page's name and a plain „În curând”. */
export async function StubPage({ titleKey }: { titleKey: StubKey }) {
  const t = await getTranslations();
  return (
    <main>
      <section className="relative isolate overflow-hidden" style={{ background: tones[toneOf[titleKey]] }}>
        <img
          loading="lazy"
          src="/img/wash.webp"
          alt=""
          aria-hidden="true"
          className="wash-in pointer-events-none absolute -top-[6%] -right-[34%] -z-10 h-[78%] w-auto max-w-none opacity-55 mix-blend-multiply sm:-right-[10%]"
          style={{ maskImage: wash, WebkitMaskImage: wash }}
        />
        <div className="mx-auto max-w-[75rem] px-4 pt-28 pb-24 sm:px-6 lg:pt-36 lg:pb-32">
          <h1 className="display text-[clamp(3.1rem,14vw,6.4rem)] font-[380] text-ink">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="rise block" style={d(0.1)}>
                {t(`nav.${titleKey}`)}
              </span>
            </span>
          </h1>
          <p className="fade-up mt-6 flex flex-wrap items-center gap-2.5 text-[1.08rem] leading-relaxed text-ink-soft" style={d(0.4)}>
            <StatusChip>{t("ui.comingSoon")}</StatusChip>
            {t("stub.line")}
          </p>
        </div>
      </section>
    </main>
  );
}
