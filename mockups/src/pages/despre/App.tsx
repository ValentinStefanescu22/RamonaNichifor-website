import { motion, useReducedMotion } from "motion/react";
import { img } from "../../shared/assets";
import { Butterfly } from "../../shared/Butterfly";
import { Ladybird } from "../../shared/Ladybird";
import { site, ui, type Text } from "../../shared/content";
import { about } from "../../shared/content-pages";
import { ArrowRight } from "../../shared/icons";
import { useLang } from "../../shared/lang";
import { PageOpener, Reveal, SectionTitle, SiteShell } from "../../site/Layout";

function Portrait() {
  return (
    <div className="relative mx-auto w-[min(76vw,380px)] pt-10">
      <span className="paint-edge absolute -inset-x-4 top-6 -bottom-4 rounded-[999px_999px_2.5rem_2.5rem] bg-lilac/45" aria-hidden="true" />
      <img src={img("portrait.webp")} alt="Ramona Nichifor" className="arch relative aspect-[4/5] w-full object-cover object-[50%_22%]" />
      {/* the cover butterfly rests on the top of the arch */}
      <div className="absolute top-0 right-[6%] w-[30%] rotate-[14deg]">
        <Butterfly width="100%" tempo={1.7} />
      </div>
      {/* and Buburuza climbs the frame at the opposite corner, so the two read as one diagonal */}
      <div className="absolute -bottom-5 -left-2 w-[22%] -rotate-[16deg]">
        <Ladybird width="100%" sway={5.6} />
      </div>
    </div>
  );
}

/** One craft as a wide brush stroke of its colour, painted in as it comes into view */
function Craft({ name, line, href, tint, index }: { name: string; line: string; href: string; tint: string; index: number }) {
  const reduce = useReducedMotion();
  const right = index % 2 === 1;
  return (
    <li className={`w-full max-w-xl ${right ? "lg:ml-auto" : ""} ${index === 2 ? "lg:ml-[12%]" : ""}`}>
      <a href={href} className="group relative block py-6">
        <svg viewBox="0 0 400 90" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-[-4%] top-1/2 h-[84px] w-[108%] -translate-y-[62%] overflow-visible" aria-hidden="true">
          <motion.path
            d="M14 52 C 90 22, 170 70, 250 40 S 360 30, 388 46"
            fill="none"
            stroke={tint}
            strokeWidth="44"
            strokeLinecap="round"
            filter="url(#paint-edge)"
            initial={{ pathLength: reduce ? 1 : 0, opacity: 0.9 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          />
        </svg>
        <span className="relative flex items-baseline justify-between gap-4">
          <span className="display text-[clamp(2.4rem,10vw,3.6rem)] font-[380] text-ink">{name}</span>
          <ArrowRight size={24} className="shrink-0 text-ink transition-transform duration-300 group-hover:translate-x-1" />
        </span>
        <span className="relative mt-2 block max-w-[36ch] text-[1.05rem] text-ink-soft">{line}</span>
      </a>
    </li>
  );
}

type Beat = { text: Text; kind?: "questions" | "close" };

function Beat({ beat, i }: { beat: Beat; i: number }) {
  const { t } = useLang();
  const text = t(beat.text);
  if (beat.kind === "questions")
    // one question per line, the way they arrive
    return (
      <Reveal i={i} className="!my-9">
        <p className="display flex flex-col gap-2 text-[clamp(1.4rem,4.4vw,1.85rem)] leading-[1.22] font-[360] text-ink">
          {text.split(/(?<=\?)\s+/).map((q) => (
            <span key={q} className="text-balance">{q}</span>
          ))}
        </p>
      </Reveal>
    );
  if (beat.kind === "close")
    return (
      <Reveal i={i} className="!mt-16">
        <p className="display text-[clamp(1.6rem,6vw,2.6rem)] leading-[1.15] font-[360] text-ink text-balance">{text}</p>
      </Reveal>
    );
  return (
    <Reveal i={i}>
      <p>{text}</p>
    </Reveal>
  );
}

/** Her name in her own hand: the stroke is revealed left to right, as if written, when it comes into view */
function Signature({ name }: { name: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.p
      className="font-script mt-10 inline-block -rotate-3 pr-4 text-[clamp(3.2rem,11vw,4.4rem)] leading-none text-violet"
      initial={reduce ? false : { clipPath: "inset(-20% 100% -20% 0)" }}
      whileInView={{ clipPath: "inset(-20% 0% -20% 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduce ? 0.4 : 1.3, ease: [0.77, 0, 0.175, 1], delay: 0.25 }}
    >
      {name}
    </motion.p>
  );
}

export default function App() {
  const { t } = useLang();
  return (
    <SiteShell current="despre" ground="cream">
      <main>
        <PageOpener
          title={t(about.title[0])}
          italic={t(about.title[1])}
          lead={<p className="display text-[clamp(1.35rem,4.6vw,1.8rem)] leading-[1.25] font-[360] text-ink">{t(site.intro)}</p>}
          background="linear-gradient(180deg, #ece4f6 0%, #f4eef6 40%, var(--color-cream) 78%)"
          aside={<Portrait />}
        >
          <p className="max-w-[40ch] text-[1.02rem] text-ink-soft">{t(about.role)}</p>
        </PageOpener>

        {/* Her story, in four movements: the words are hers, the breath between them is the layout */}
        <section className="bg-cream px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
            <h2 className="display text-[clamp(2.2rem,8.5vw,3.8rem)] font-[380] text-ink lg:sticky lg:top-28 lg:self-start">
              {t(ui.myStory)}
            </h2>
            <div className="max-w-[58ch] text-[1.08rem] leading-[1.65] text-ink">
              {about.story.map((movement, m) => (
                <div key={m} className={`space-y-5 ${m > 0 ? "mt-16 lg:mt-20" : ""}`}>
                  {movement.map((beat, i) => (
                    <Beat key={i} beat={beat} i={i} />
                  ))}
                </div>
              ))}
              <Signature name={about.signature} />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-cream px-4 pt-8 pb-24 sm:px-6 lg:pb-32">
          <div className="mx-auto max-w-6xl">
            <SectionTitle>{t(about.crafts.title)}</SectionTitle>
            <ul className="mt-10 flex flex-col gap-4 lg:mt-14 lg:gap-2">
              {about.crafts.items.map((c, i) => (
                <Craft key={c.id} index={i} name={t(c.name)} line={t(c.line)} href={c.href} tint={c.tint} />
              ))}
            </ul>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
