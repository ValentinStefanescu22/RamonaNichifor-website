import { useTranslations } from "next-intl";
import type { Counselling } from "@/content/types";
import { Reveal } from "@/components/page/Reveal";
import { WhatsApp } from "@/components/ui/icons";
import { PillLink, TextLink } from "@/components/ui/links";
import { Path } from "./Path";

/** „Ce se repetă în viața ta?”: her questions, the reflexes, the distinction she guides toward, the path, and what change means to her */
export function Patterns({ patterns: c, whatsapp }: { patterns: Counselling["patterns"]; whatsapp: string }) {
  const t = useTranslations("counselling");
  return (
    <section className="bg-cream px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
        <h2 className="display text-[clamp(2.2rem,8.5vw,3.8rem)] leading-[1.05] font-[380] text-ink lg:sticky lg:top-28 lg:self-start">{c.title}</h2>
        <div className="max-w-[58ch] text-[1.08rem] leading-[1.65] text-ink">
          <div className="display flex flex-col gap-3 text-[clamp(1.35rem,4.4vw,1.8rem)] leading-[1.22] font-[360]">
            {c.questions.map((q, i) => (
              <Reveal key={q} i={i}>
                <p className="text-balance">{q}</p>
              </Reveal>
            ))}
          </div>
          {/* the reflexes, short and one under another, the way they happen */}
          <ul className="mt-10 flex flex-col gap-2 border-l-2 border-leaf/35 pl-5">
            {c.reactions.map((r, i) => (
              <li key={r} className="text-[1.15rem] text-ink-soft italic">
                <Reveal i={i}>{r}</Reveal>
              </li>
            ))}
          </ul>
          <Reveal className="mt-14">
            <p className="display text-[clamp(1.6rem,5.6vw,2.4rem)] leading-[1.15] font-[360] text-balance">{c.thesis}</p>
          </Reveal>
        </div>
      </div>
      <div className="mx-auto max-w-6xl">
        <Path stops={c.path} label={t("pathLabel")} />
      </div>
      <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:mt-24 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
        <div aria-hidden="true" />
        <div className="max-w-[58ch] text-[1.08rem] leading-[1.65] text-ink">
          <Reveal>
            <p>{c.explain}</p>
          </Reveal>
          <Reveal i={1} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <PillLink href={whatsapp} external icon={<WhatsApp size={18} />}>
              {t("whatsapp")}
            </PillLink>
            <TextLink href="#programare">{t("book")}</TextLink>
          </Reveal>
          <Reveal className="mt-16">
            <p className="display text-[clamp(1.5rem,5vw,2.1rem)] leading-[1.2] font-[360] text-balance">{c.change}</p>
          </Reveal>
          <Reveal i={1} className="mt-5">
            <p className="display text-[clamp(1.5rem,5vw,2.1rem)] leading-[1.2] font-[360] text-violet italic">{c.closer}</p>
          </Reveal>
          <ul className="mt-7 flex flex-col gap-2.5">
            {c.toward.map((x, i) => (
              <li key={x}>
                <Reveal i={i} className="flex items-baseline gap-3">
                  <span className="size-1.5 shrink-0 translate-y-[-0.2em] rounded-full bg-leaf" aria-hidden="true" />
                  {x}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
