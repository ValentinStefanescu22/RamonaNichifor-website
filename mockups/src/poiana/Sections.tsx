import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { img } from "../shared/assets";
import { Butterfly } from "../shared/Butterfly";
import { art, book, counselling, nav, pillars, site, ui, universes } from "../shared/content";
import { CopyEmail } from "../shared/CopyEmail";
import { Creature } from "../shared/creatures";
import { Armchair, ArrowRight, Brush, OpenBook, Video, WhatsApp } from "../shared/icons";
import { useLang } from "../shared/lang";
import { BuySoon, PillLink, TextLink } from "../site/Layout";

function SectionTitle({ children, lead, className = "" }: { children: ReactNode; lead?: ReactNode; className?: string }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <h2 className="display text-[clamp(2.4rem,9vw,4.2rem)] font-[380] text-ink">{children}</h2>
      {lead && <div className="mt-4 max-w-[52ch] text-[1.08rem] leading-relaxed text-ink-soft">{lead}</div>}
    </div>
  );
}

export function Paths() {
  const { t } = useLang();
  const rows = [
    { href: "carti.html", icon: OpenBook, tint: "var(--color-petal)", ...pillars.books },
    { href: "arta.html", icon: Brush, tint: "#dce8f5", ...pillars.art },
    { href: "consiliere.html", icon: Armchair, tint: "var(--color-sage)", ...pillars.counselling },
  ];
  return (
    <section aria-label={t(site.rolesShort)} className="relative bg-cream px-4 pt-14 pb-20 sm:px-6 lg:pt-24">
      <div className="mx-auto max-w-6xl">
        <p className="display max-w-[24ch] text-[clamp(1.6rem,6vw,2.6rem)] leading-[1.15] font-[360] text-ink">{t(site.intro)}</p>
        <ul className="mt-10 grid gap-3 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {rows.map(({ href, icon: Icon, tint, title, line }) => (
            <li key={href}>
              <a
                href={href}
                className="group relative flex min-h-24 items-center gap-4 rounded-[1.75rem] py-4 pr-4 pl-4 transition-colors duration-300 hover:bg-white/60 lg:flex-col lg:items-start lg:gap-5 lg:p-6"
              >
                <span className="relative grid size-14 shrink-0 place-items-center text-ink">
                  <span className="paint-edge absolute inset-0 rounded-full" style={{ background: tint }} />
                  <Icon size={24} className="relative" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="display block text-[1.55rem] leading-tight text-ink">{t(title)}</span>
                  <span className="mt-1 block text-[0.98rem] leading-snug text-ink-soft">{t(line)}</span>
                </span>
                <ArrowRight size={20} className="shrink-0 text-violet transition-transform duration-300 group-hover:translate-x-1 lg:absolute lg:top-7 lg:right-6" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Universes({ perchRef, landed }: { perchRef: RefObject<HTMLDivElement | null>; landed: boolean }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  return (
    <section id="universuri" className="relative scroll-mt-20 overflow-hidden bg-cream pt-10 pb-24 lg:pt-16">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6">
        <SectionTitle
          lead={
            <>
              <span className="display text-[1.25rem] italic text-violet">„{t(site.series)}”</span>
              <span className="mt-1 block">{t(site.seriesLead)}</span>
            </>
          }
        >
          {t(nav.universes)}
        </SectionTitle>
      </div>

      <ul className="snap-row mt-10 flex gap-4 overflow-x-auto px-[max(1rem,calc((100vw-72rem)/2))] sm:px-[max(1.5rem,calc((100vw-72rem)/2))] pb-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
        {universes.map((u) => {
          const live = u.status === "available";
          // the Fluture window is the butterfly's home: its meadow is where the flight lands
          const meadow = u.id === "fluture";
          return (
            <li key={u.id} className="w-[72vw] max-w-[300px] shrink-0 lg:w-auto lg:max-w-none">
              <a
                href={`universuri.html#${u.id}`}
                className="group relative block"
              >
                <div
                  className="arch relative aspect-[3/4] overflow-hidden shadow-soft"
                  style={{
                    background: meadow
                      ? "linear-gradient(180deg, var(--color-sky) 0%, var(--color-mist) 42%, var(--color-cream) 70%)"
                      : u.id === "buburuza"
                        ? `linear-gradient(180deg, var(--color-sky) 0%, ${u.tint[0]} 38%, #fbf1e2 70%)`
                        : u.tint[0],
                  }}
                >
                  {meadow ? (
                    <>
                      <img
                        src={img("meadow.webp")}
                        alt=""
                        className="absolute inset-x-0 bottom-0 h-[64%] w-full object-cover object-[40%_100%] transition-transform duration-[1.4s] ease-(--ease-bloom) group-hover:scale-[1.04]"
                      />
                      {/* The butterfly comes home to its meadow here */}
                      <div ref={perchRef} className="absolute top-[13%] left-1/2 w-[48%] -translate-x-1/2" aria-hidden="true">
                        <div style={{ opacity: landed || reduce ? 1 : 0 }}>
                          <Butterfly width="100%" tempo={1.5} />
                        </div>
                      </div>
                    </>
                  ) : u.id === "buburuza" ? (
                    // her own cover painting, the way the Fluture window is the meadow from his
                    <img
                      src={img("buburuza-scene.webp")}
                      alt=""
                      className="absolute inset-x-0 bottom-0 h-[82%] w-full object-cover object-[46%_100%] transition-transform duration-[1.4s] ease-(--ease-bloom) group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="relative grid h-full place-items-center">
                      <span
                        className="paint-edge absolute inset-[12%] rounded-full opacity-80"
                        style={{ background: `radial-gradient(circle at 40% 35%, ${u.tint[0]}, ${u.tint[1]} 70%)` }}
                      />
                      <Creature id={u.id as "buburuza"} size={112} className="relative" style={{ color: u.tint[2] }} />
                    </div>
                  )}
                  <span
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[0.78rem] font-semibold whitespace-nowrap"
                    style={{ background: "rgb(251 247 241 / 0.88)", color: u.tint[2] }}
                  >
                    {t(live ? ui.bookOut : ui.comingSoon)}
                  </span>
                </div>
                <div className="px-1 pt-4">
                  <h3 className="display text-[1.4rem] leading-tight text-ink">{t(u.name)}</h3>
                  <p className="mt-1 text-[0.98rem] italic text-ink-soft">{t(u.book)}</p>
                  {/* every world has its own page, including the ones still „în curând” */}
                  <span className={`mt-3 inline-flex min-h-11 items-center gap-2 font-semibold ${meadow ? "text-magenta" : "text-ink-soft"}`}>
                    {t(ui.discover)}
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function TiltCover() {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const { t } = useLang();
  return (
    <div
      ref={ref}
      className="mx-auto w-[min(72vw,340px)] [perspective:1200px] lg:w-[400px]"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <motion.img
        src={img("cover-fluturele.webp")}
        alt={t(book.title)}
        className="shadow-book aspect-[766/1120] w-full rounded-r-[10px] rounded-l-[4px] object-cover"
        style={{ rotateX: rx, rotateY: ry, rotateZ: -2.5 }}
      />
    </div>
  );
}

export function Book() {
  const { t } = useLang();
  return (
    <section
      id="carte"
      className="relative scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28"
      style={{ background: "linear-gradient(180deg, var(--color-cream), var(--color-petal) 38%, var(--color-cream))" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <TiltCover />
        <div className="min-w-0">
          <h2 className="display text-[clamp(2.3rem,8.5vw,4rem)] font-[380] text-ink">{t(book.title)}</h2>
          <p className="display mt-3 text-[1.3rem] leading-snug italic text-ink-soft">{t(book.subtitle)}</p>
          <p className="mt-3 text-[0.95rem] font-semibold text-violet">
            {t(book.audience)} · {book.year} · „{t(site.series)}”
          </p>
          <div className="mt-6 max-w-[58ch] space-y-4 text-[1.05rem] leading-relaxed text-ink-soft">
            {book.blurb.map((p, i) => (
              <p key={i}>{t(p)}</p>
            ))}
          </div>
          <PillLink href="carte.html" icon={<ArrowRight size={17} />} className="mt-8">
            {t(ui.aboutBook)}
          </PillLink>
          <BuySoon link={false} className="mt-5" />
          <p className="mt-3 text-[0.92rem] text-ink-soft tabular-nums">ISBN {book.isbn}</p>
        </div>
      </div>
    </section>
  );
}

export function About() {
  const { t } = useLang();
  return (
    <section id="despre" className="relative scroll-mt-20 bg-cream px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="relative mx-auto w-[min(78vw,360px)]">
          <span className="paint-edge absolute -inset-4 rounded-[999px_999px_2.5rem_2.5rem] bg-lilac/45" aria-hidden="true" />
          <img
            src={img("portrait.webp")}
            alt="Ramona Nichifor"
            className="arch relative aspect-[4/5] w-full object-cover object-[50%_22%]"
          />
        </div>
        <div className="min-w-0">
          <SectionTitle>{t(nav.about)}</SectionTitle>
          <p className="display mt-6 max-w-[26ch] text-[clamp(1.4rem,5vw,2rem)] leading-[1.25] font-[360] text-ink">{t(site.intro)}</p>
          <p className="mt-5 max-w-[52ch] text-[1.02rem] text-ink-soft">{t(site.roles)}</p>
          <TextLink href="despre.html" className="mt-6">
            {t(ui.myStory)}
          </TextLink>
        </div>
      </div>
    </section>
  );
}

export function Art() {
  const { t } = useLang();
  return (
    <section id="arta" className="relative scroll-mt-20 overflow-hidden bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6">
        <SectionTitle lead={t(art.lead)}>{t(art.title)}</SectionTitle>
      </div>
      <ul className="snap-row mt-12 flex gap-5 overflow-x-auto px-[max(1rem,calc((100vw-72rem)/2))] sm:px-[max(1.5rem,calc((100vw-72rem)/2))] pb-4 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible">
        {art.pieces.map((p, i) => (
          <li key={p.src} className={`w-[70vw] max-w-[320px] shrink-0 lg:w-auto lg:max-w-none ${i === 1 ? "lg:mt-16" : ""}`}>
            <figure>
              <div className="rounded-[4px] bg-[#fffdf9] p-3 shadow-soft">
                <img src={img(p.src)} alt={t(p.title)} className="aspect-[4/5] w-full object-cover" />
              </div>
              <figcaption className="px-1 pt-4">
                <span className="display block text-[1.25rem] text-ink">{t(p.title)}</span>
                <span className="text-[0.95rem] text-ink-soft">{t(p.kind)}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-8 flex max-w-[75rem] flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
        <p className="text-[0.92rem] italic text-ink-soft">{t(ui.exampleNote)}</p>
        <TextLink href="arta.html">{t(ui.seeGallery)}</TextLink>
      </div>
    </section>
  );
}

export function Counselling() {
  const { t, lang } = useLang();
  return (
    <section id="consiliere" className="relative scroll-mt-20 bg-sage px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <blockquote className="display max-w-[20ch] text-[clamp(1.9rem,7.4vw,3.6rem)] leading-[1.12] font-[360] text-ink">
          {site.manifesto.map((line, i) => (
            <span key={i} className="block">
              {line[lang][0]}
              <em className="display-wonk text-magenta">{line[lang][1]}</em>
              {line[lang][2]}
            </span>
          ))}
        </blockquote>
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="min-w-0">
            <h2 className="display text-[clamp(1.9rem,6.5vw,2.8rem)] leading-[1.08] font-[380] text-ink">{t(counselling.title)}</h2>
            <p className="mt-4 max-w-[48ch] text-[1.06rem] leading-relaxed text-ink-soft">{t(counselling.lead)}</p>
          </div>
          <div className="min-w-0">
            <ul className="grid gap-5 sm:grid-cols-2">
              {counselling.formats.map((f, i) => {
                const Icon = i === 0 ? Video : Armchair;
                return (
                  <li key={i} className="flex gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream text-leaf">
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="display block text-[1.25rem] text-ink">{t(f.title)}</span>
                      <span className="text-[0.98rem] leading-snug text-ink-soft">{t(f.line)}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-col items-start gap-3">
              <a
                href={site.contact.whatsapp.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-5 font-medium text-cream shadow-soft transition-transform duration-150 active:scale-[0.97]"
              >
                {t(ui.bookConversation)}
                <span className="grid size-9 place-items-center rounded-full bg-cream/15">
                  <WhatsApp size={18} />
                </span>
              </a>
              <CopyEmail className="text-[0.98rem] text-ink-soft [&_button]:bg-cream/70 [&_button]:text-ink" />
              <TextLink href="consiliere.html">{t(ui.howIWork)}</TextLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
