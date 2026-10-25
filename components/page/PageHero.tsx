import type { CSSProperties, ReactNode } from "react";

export type HeroTone = "petal" | "sage" | "lilac" | "mist" | "sky" | "cream";

// Each opener tints the sky toward the page's own colour and ends on the colour its footer starts from (ChromeShell groundOf).
const tones: Record<HeroTone, string> = {
  petal: "linear-gradient(180deg, #f9e8ef 0%, var(--color-petal) 46%, var(--color-cream) 96%)",
  sage: "linear-gradient(180deg, #e9efe2 0%, var(--color-sage) 60%, #eef2e8 100%)",
  lilac: "linear-gradient(180deg, #ece4f6 0%, #f4eef6 40%, var(--color-cream) 78%)",
  mist: "linear-gradient(180deg, #e2ecf7 0%, var(--color-mist) 60%)",
  sky: "radial-gradient(90% 45% at 88% 6%, rgb(255 255 255 / 0.55), transparent 62%), radial-gradient(80% 40% at 8% 42%, rgb(201 184 230 / 0.35), transparent 68%), linear-gradient(180deg, #cddff1 0%, #e1eaf6 26%, #ece6f5 54%, #f6e2ea 80%, var(--color-cream) 100%)",
  cream: "linear-gradient(180deg, var(--color-mist) 0%, var(--color-cream) 70%)",
};

const wash = "radial-gradient(ellipse 60% 55% at 70% 40%, #000 30%, transparent 100%)";
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * The top of every inner page (mockups/src/site/Layout.tsx PageOpener): one display <h1> that rises into place, an optional
 * second line in violet WONK italic, a tagline, a lead, actions, and the page's own signature element beside it.
 * Server component: the entrance is the CSS `rise` / `fade-up` of globals.css (off under reduced motion).
 */
export function PageHero({
  title,
  titleItalic,
  tagline,
  lead,
  tone = "sky",
  bottom = "pb-14 lg:pb-20",
  aside,
  children,
}: {
  title: string;
  /** Second line, violet WONK italic: the way the home sets „Ramona / Nichifor” */
  titleItalic?: string;
  tagline?: string;
  lead?: ReactNode;
  tone?: HeroTone;
  /** Bottom padding classes: how much air the page leaves under the opener */
  bottom?: string;
  /** The page's own signature element, beside the text from 1024px (the text column is then ~480px: keep words under ~11 letters) and below it on a phone */
  aside?: ReactNode;
  /** Actions (pills, links) under the lead */
  children?: ReactNode;
}) {
  // Each line sits in an overflow-hidden box (for the rise), so a long word („Confidențialitate”) would be cut off on a 320px
  // phone: past 14 letters the size also follows the width (a Fraunces letter is ~0.42em wide; 200vw leaves margin)
  const longest = Math.max(...`${title} ${titleItalic ?? ""}`.split(/\s+/).map((w) => w.length));
  const fit = longest > 14 ? { fontSize: `min(clamp(3.1rem, 14vw, 6.4rem), ${(200 / longest).toFixed(2)}vw)` } : undefined;
  return (
    <section className="relative isolate overflow-hidden" style={{ background: tones[tone] }}>
      <img
        loading="lazy"
        src="/img/wash.webp"
        alt=""
        aria-hidden="true"
        className="wash-in pointer-events-none absolute -top-[6%] -right-[34%] -z-10 h-[78%] w-auto max-w-none opacity-55 mix-blend-multiply sm:-right-[10%]"
        style={{ maskImage: wash, WebkitMaskImage: wash }}
      />
      <div className={`mx-auto grid max-w-[75rem] items-center gap-10 px-4 pt-28 sm:px-6 lg:gap-16 lg:pt-36 ${bottom} ${aside ? "lg:grid-cols-[1.05fr_0.95fr]" : ""}`}>
        <div className="min-w-0">
          <h1 className="display text-[clamp(3.1rem,14vw,6.4rem)] font-[380] text-ink" style={fit}>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="rise block" style={d(0.1)}>
                {title}
              </span>
            </span>
            {titleItalic && " "}
            {titleItalic && (
              <span className="block overflow-hidden pb-[0.12em] pl-[0.6em] sm:pl-[0.9em]">
                <span className="rise display-wonk block text-violet italic" style={d(0.22)}>
                  {titleItalic}
                </span>
              </span>
            )}
          </h1>
          {tagline && (
            <p className="fade-up display mt-5 max-w-[24ch] text-[clamp(1.3rem,4.6vw,1.8rem)] leading-[1.2] text-ink-soft italic" style={d(0.4)}>
              {tagline}
            </p>
          )}
          {lead && (
            <div className="fade-up mt-4 max-w-[46ch] text-[1.08rem] leading-relaxed text-ink-soft" style={d(0.5)}>
              {lead}
            </div>
          )}
          {children && (
            <div className="fade-up mt-7" style={d(0.6)}>
              {children}
            </div>
          )}
        </div>
        {aside && (
          <div className="fade-up min-w-0" style={d(0.35)}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
