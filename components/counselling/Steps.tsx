import { useTranslations } from "next-intl";
import type { Counselling } from "@/content/types";

/** „Cum decurge”: the steps grow along a stem that draws itself as the visitor reads down (CSS, .stem in globals.css) */
export function Steps({ steps }: { steps: Counselling["steps"] }) {
  const t = useTranslations("counselling");
  if (steps.length === 0) return null;
  return (
    <section className="bg-cream px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
        <h2 className="display text-[clamp(2.2rem,8.5vw,3.8rem)] font-[380] text-ink lg:sticky lg:top-28 lg:self-start">{t("stepsTitle")}</h2>
        <div className="min-w-0">
          <ol className="steps relative flex flex-col gap-10 pl-14 sm:pl-16">
            <span className="absolute top-2 bottom-2 left-[1.15rem] w-[2px] rounded-full bg-leaf/20 sm:left-[1.4rem]" aria-hidden="true" />
            <span className="stem absolute top-2 bottom-2 left-[1.15rem] w-[2px] origin-top rounded-full bg-leaf sm:left-[1.4rem]" aria-hidden="true" />
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="display display-wonk absolute top-[-0.2em] -left-14 grid size-10 place-items-center rounded-full bg-cream text-[1.5rem] text-leaf italic ring-1 ring-leaf/30 sm:-left-16 sm:size-12" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="display text-[1.55rem] leading-tight text-ink">{s.title}</h3>
                {s.text && <p className="mt-1.5 max-w-[46ch] text-[1.05rem] leading-relaxed text-ink-soft">{s.text}</p>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
