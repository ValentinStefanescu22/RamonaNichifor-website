import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { counselling, nav, site } from "../../shared/content";
import { booking, counsellingPage } from "../../shared/content-pages";
import { Armchair, ArrowDown, Plus, Video } from "../../shared/icons";
import { useLang } from "../../shared/lang";
import { PageOpener, PillLink, SectionTitle, SiteShell, TextLink } from "../../site/Layout";
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

/** Steps grow along a stem that draws itself as the visitor reads down */
function Steps() {
  const { t } = useLang();
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <ol ref={ref} className="relative mt-10 flex flex-col gap-10 pl-14 sm:pl-16">
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

        <section className="bg-cream px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="min-w-0">
              <SectionTitle>{t(counsellingPage.approachTitle)}</SectionTitle>
              <div className="mt-6 max-w-[56ch] space-y-5 text-[1.08rem] leading-[1.75] text-ink-soft">
                {counsellingPage.approach.map((p, i) => (
                  <p key={i}>{t(p)}</p>
                ))}
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="display text-[clamp(2rem,7vw,3rem)] font-[380] text-ink">{t(counsellingPage.stepsTitle)}</h2>
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
