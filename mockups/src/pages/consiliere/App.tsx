import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { counselling, nav, site } from "../../shared/content";
import { booking, counsellingPage } from "../../shared/content-pages";
import { Armchair, ArrowDown, Plus, Video, WhatsApp } from "../../shared/icons";
import { useLang } from "../../shared/lang";
import { PageOpener, PillLink, Reveal, SectionTitle, SiteShell, TextLink } from "../../site/Layout";
import { BookingSection } from "./Booking";

function Formats() {
  const { t } = useLang();
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {counsellingPage.formats.map((f, i) => {
        const Icon = i === 0 ? Video : Armchair;
        return (
          <li key={f.id} className="flex gap-4 rounded-[1.75rem] bg-cream/70 p-5 ring-1 ring-ink/5 backdrop-blur-sm">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sage text-leaf">
              <Icon size={22} />
            </span>
            <span className="min-w-0">
              <span className="display block text-[1.4rem] leading-tight text-ink">{t(f.title)}</span>
              <span className="mt-1 block text-[0.98rem] leading-snug text-ink-soft">{t(f.line)}</span>
              <span className="mt-2 block font-semibold text-ink tabular-nums">{t(f.detail)}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** tipare → … → alegere conștientă: six painted stops joined by a line that draws itself once, in reading order */
function Path() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const stops = counsellingPage.patterns.path;
  const view = { once: true, margin: "0px 0px -15% 0px" } as const;
  const ease = [0.23, 1, 0.32, 1] as const;
  return (
    <motion.ol
      aria-label={t(counsellingPage.patterns.pathLabel)}
      className="relative mt-12 grid gap-7 pl-12 lg:mt-16 lg:grid-cols-6 lg:gap-4 lg:pl-0"
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={view}
    >
      {/* the line: down the left edge on phones, across the stops on laptop */}
      <motion.span
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-[0.95rem] w-[2px] origin-top rounded-full bg-leaf/45 lg:hidden"
        variants={{ hidden: { transform: "scaleY(0)" }, shown: { transform: "scaleY(1)", transition: { duration: 1.4, ease } } }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute top-[1.15rem] right-[8%] left-[8%] hidden h-[2px] origin-left rounded-full bg-leaf/45 lg:block"
        variants={{ hidden: { transform: "scaleX(0)" }, shown: { transform: "scaleX(1)", transition: { duration: 1.4, ease } } }}
      />
      {stops.map((s, i) => {
        const last = i === stops.length - 1;
        return (
          <motion.li
            key={s.ro}
            className="relative flex items-center gap-4 lg:flex-col lg:gap-3 lg:text-center"
            variants={{
              hidden: { opacity: 0, transform: "translateY(10px)" },
              shown: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.6, ease, delay: 0.15 + i * 0.16 } },
            }}
          >
            <span
              className={`paint-edge relative -ml-12 grid size-[2.4rem] shrink-0 place-items-center rounded-full lg:ml-0 ${last ? "bg-lilac" : "bg-sage"}`}
              aria-hidden="true"
            >
              <span className={`size-2.5 rounded-full ${last ? "bg-violet" : "bg-leaf"}`} />
            </span>
            <span className={`display text-[1.35rem] leading-tight lg:text-[1.2rem] ${last ? "italic text-violet" : "text-ink"}`}>{t(s)}</span>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}

/** „Ce se repetă în viața ta?”: her questions, the reflexes, the distinction she guides toward, the path, and what change means to her */
function Patterns() {
  const { t } = useLang();
  const c = counsellingPage.patterns;
  return (
    <section className="bg-cream px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
        <h2 className="display text-[clamp(2.2rem,8.5vw,3.8rem)] leading-[1.05] font-[380] text-ink lg:sticky lg:top-28 lg:self-start">{t(c.title)}</h2>
        <div className="max-w-[58ch] text-[1.08rem] leading-[1.65] text-ink">
          <div className="display flex flex-col gap-3 text-[clamp(1.35rem,4.4vw,1.8rem)] leading-[1.22] font-[360]">
            {c.questions.map((q, i) => (
              <Reveal key={q.ro} i={i}>
                <p className="text-balance">{t(q)}</p>
              </Reveal>
            ))}
          </div>
          {/* the reflexes, short and one under another, the way they happen */}
          <ul className="mt-10 flex flex-col gap-2 border-l-2 border-leaf/35 pl-5">
            {c.reactions.map((r, i) => (
              <li key={r.ro} className="text-[1.15rem] text-ink-soft italic">
                <Reveal i={i}>{t(r)}</Reveal>
              </li>
            ))}
          </ul>
          <Reveal i={0} className="mt-14">
            <p className="display text-[clamp(1.6rem,5.6vw,2.4rem)] leading-[1.15] font-[360] text-balance">{t(c.thesis)}</p>
          </Reveal>
        </div>
      </div>
      <div className="mx-auto max-w-6xl">
        <Path />
      </div>
      <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:mt-24 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
        <div aria-hidden="true" />
        <div className="max-w-[58ch] text-[1.08rem] leading-[1.65] text-ink">
          <Reveal i={0}>
            <p>{t(c.explain)}</p>
          </Reveal>
          <Reveal i={1} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <PillLink href={site.contact.whatsapp.href} external icon={<WhatsApp size={18} />}>
              {t(counsellingPage.whatsappLink)}
            </PillLink>
            <TextLink href="#programare">{t(booking.cta)}</TextLink>
          </Reveal>
          <Reveal i={0} className="mt-16">
            <p className="display text-[clamp(1.5rem,5vw,2.1rem)] leading-[1.2] font-[360] text-balance">{t(c.change)}</p>
          </Reveal>
          <Reveal i={1} className="mt-5">
            <p className="display text-[clamp(1.5rem,5vw,2.1rem)] leading-[1.2] font-[360] text-violet italic">{t(c.closer)}</p>
          </Reveal>
          <ul className="mt-7 flex flex-col gap-2.5">
            {c.toward.map((x, i) => (
              <li key={x.ro}>
                <Reveal i={i} className="flex items-baseline gap-3">
                  <span className="size-1.5 shrink-0 translate-y-[-0.2em] rounded-full bg-leaf" aria-hidden="true" />
                  {t(x)}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** „Cum știi dacă este pentru tine?”: the four ways she might find you, then the space she offers */
function RightForYou() {
  const { t } = useLang();
  const r = counsellingPage.rightForYou;
  return (
    <section className="px-4 py-20 sm:px-6 lg:py-28" style={{ background: "linear-gradient(180deg, var(--color-cream) 0%, #f1f4ec 18%, #f1f4ec 82%, var(--color-cream) 100%)" }}>
      <div className="mx-auto max-w-[58ch] text-[1.08rem] leading-[1.65] text-ink lg:max-w-[62ch]">
        <SectionTitle>{t(r.title)}</SectionTitle>
        <div className="display mt-10 flex flex-col gap-3 text-[clamp(1.3rem,4.2vw,1.7rem)] leading-[1.25] font-[360]">
          {r.maybe.map((m, i) => (
            <Reveal key={m.ro} i={i}>
              <p className="text-balance">{t(m)}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 space-y-5">
          {r.body.map((b, i) => (
            <Reveal key={b.ro} i={i}>
              <p>{t(b)}</p>
            </Reveal>
          ))}
        </div>
        <Reveal i={0} className="mt-10">
          <p className="display text-[clamp(1.5rem,5vw,2.1rem)] font-[360] italic text-ink">{t(r.simply)}</p>
        </Reveal>
        <Reveal i={0} className="mt-14">
          <p className="display text-[clamp(1.9rem,7vw,3rem)] leading-[1.1] font-[360] text-violet italic">{t(r.here)}</p>
        </Reveal>
        <div className="mt-6 space-y-5">
          {r.offer.map((o, i) => (
            <Reveal key={o.ro} i={i}>
              <p>{t(o)}</p>
            </Reveal>
          ))}
          <Reveal i={2}>
            <p className="font-medium">{t(r.close)}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Steps grow along a stem that draws itself as the visitor reads down */
function Steps() {
  const { t } = useLang();
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <ol ref={ref} className="relative flex flex-col gap-10 pl-14 sm:pl-16">
      <span className="absolute top-2 bottom-2 left-[1.15rem] w-[2px] rounded-full bg-leaf/20 sm:left-[1.4rem]" aria-hidden="true" />
      <motion.span
        className="absolute top-2 bottom-2 left-[1.15rem] w-[2px] origin-top rounded-full bg-leaf sm:left-[1.4rem]"
        style={{ scaleY: reduce ? 1 : grow }}
        aria-hidden="true"
      />
      {counsellingPage.steps.map((s, i) => (
        <li key={i} className="relative">
          <span className="display display-wonk absolute top-[-0.2em] -left-14 grid size-10 place-items-center rounded-full bg-cream text-[1.5rem] italic text-leaf ring-1 ring-leaf/30 sm:-left-16 sm:size-12">
            {i + 1}
          </span>
          <h3 className="display text-[1.55rem] leading-tight text-ink">{t(s.title)}</h3>
          <p className="mt-1.5 max-w-[46ch] text-[1.05rem] leading-relaxed text-ink-soft">{t(s.line)}</p>
        </li>
      ))}
    </ol>
  );
}

function Faq() {
  const { t } = useLang();
  return (
    <div className="faq mt-8 border-t border-ink/12">
      {counsellingPage.faq.map((f, i) => (
        <details key={i} className="group border-b border-ink/12">
          <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-4 py-4 text-left">
            <span className="display text-[1.3rem] leading-snug text-ink">{t(f.q)}</span>
            <span className="faq-plus grid size-10 shrink-0 place-items-center rounded-full bg-cream text-ink ring-1 ring-ink/10">
              <Plus size={18} />
            </span>
          </summary>
          <p className="max-w-[58ch] pb-6 text-[1.05rem] leading-relaxed text-ink-soft">{t(f.a)}</p>
        </details>
      ))}
    </div>
  );
}

export default function App() {
  const { t } = useLang();
  return (
    <SiteShell current="consiliere" ground="sage">
      <main>
        <PageOpener
          title={t(nav.counselling)}
          tagline={t(counsellingPage.tagline)}
          lead={<p>{t(counselling.title)}</p>}
          background="linear-gradient(180deg, #e9efe2 0%, var(--color-sage) 70%)"
          aside={<Formats />}
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <PillLink href="#programare" icon={<ArrowDown size={18} />}>
              {t(booking.cta)}
            </PillLink>
            <TextLink href={site.contact.whatsapp.href} external>
              {t(counsellingPage.whatsappLink)}
            </TextLink>
          </div>
        </PageOpener>

        <Patterns />
        <RightForYou />

        <section className="bg-cream px-4 py-20 sm:px-6 lg:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
            <h2 className="display text-[clamp(2.2rem,8.5vw,3.8rem)] font-[380] text-ink lg:sticky lg:top-28 lg:self-start">{t(counsellingPage.stepsTitle)}</h2>
            <div className="min-w-0">
              <Steps />
            </div>
          </div>
        </section>

        <BookingSection />

        <section className="px-4 pt-4 pb-20 sm:px-6 lg:pb-28" style={{ background: "linear-gradient(180deg, var(--color-cream), #eef2e8)" }}>
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <SectionTitle>{t(counsellingPage.faqTitle)}</SectionTitle>
              <Faq />
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6" style={{ background: "#eef2e8" }}>
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 rounded-[2rem] bg-sage px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="display max-w-[18ch] text-[clamp(1.6rem,6vw,2.6rem)] leading-[1.12] font-[360] text-ink">{t(counsellingPage.ctaTitle)}</h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <PillLink href="#programare" icon={<ArrowDown size={18} className="rotate-180" />}>
                {t(booking.cta)}
              </PillLink>
              <TextLink href={site.contact.whatsapp.href} external>
                {t(counsellingPage.whatsappLink)}
              </TextLink>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
