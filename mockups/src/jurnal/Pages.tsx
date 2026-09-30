import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { img } from "../shared/assets";
import { Butterfly } from "../shared/Butterfly";
import { ages, art, book, counselling, mockupNote, nav, site, ui, universes } from "../shared/content";
import { CopyEmail } from "../shared/CopyEmail";
import { Creature } from "../shared/creatures";
import { Armchair, ArrowRight, ArrowUpRight, Video, WhatsApp } from "../shared/icons";
import { useLang } from "../shared/lang";
import { Socials } from "./Chrome";
import { chapterLines, chapters, words } from "./journal";

const vars = (v: Record<string, string | number>) => v as CSSProperties;

export function InkDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <filter id="watercolor" x="-5%" y="-60%" width="110%" height="220%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="8" result="d" />
        <feGaussianBlur in="d" stdDeviation="0.7" />
      </filter>
      <filter id="blot" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="9" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="18" />
      </filter>
    </svg>
  );
}

/** A word with a watercolour stroke painted under it */
function Painted({ children, color, delay }: { children: ReactNode; color: string; delay: number }) {
  return (
    <span className="relative isolate inline-block whitespace-nowrap">
      <svg
        viewBox="0 0 100 14"
        preserveAspectRatio="none"
        className="absolute -right-[4%] bottom-[0.02em] -left-[3%] -z-10 h-[0.46em] w-[107%] mix-blend-multiply"
        aria-hidden="true"
      >
        {/* a wash, then a second pass where the pigment pools */}
        <path
          d="M2 9 C 22 4, 48 12, 70 7 S 92 5, 98 8"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter="url(#watercolor)"
          opacity="0.62"
          className="draw"
          style={vars({ "--len": 120, "--d": `${delay}s`, "--dur": "0.9s" })}
          pathLength={120}
        />
        <path
          d="M6 10 C 26 7, 50 12, 72 9 S 90 8, 95 9"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter="url(#watercolor)"
          opacity="0.5"
          className="draw"
          style={vars({ "--len": 120, "--d": `${delay + 0.18}s`, "--dur": "0.8s" })}
          pathLength={120}
        />
      </svg>
      <em>{children}</em>
    </span>
  );
}

function PageNumber({ n }: { n: number }) {
  const { t } = useLang();
  return (
    <p className="mt-16 text-center text-[0.9rem] text-ink-soft tabular-nums">
      <span className="sr-only">{t(words.page)} </span>— {n} —
    </p>
  );
}

function Tape({ className, color, rotate }: { className: string; color: string; rotate: number }) {
  return <span className={`tape ${className}`} style={{ background: color, transform: `rotate(${rotate}deg)` }} aria-hidden="true" />;
}

export function FirstPage() {
  const { t, lang } = useLang();
  const underline = ["var(--color-wash-pink)", "var(--color-wash-blue)", "var(--color-tape-lilac)"];
  return (
    <section id="despre" className="relative lg:px-8 lg:pt-2 lg:pb-10">
      <div className="paper relative mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:rounded-md lg:page-shadow">
        {/* the gutter of an open journal */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-24 -translate-x-1/2 lg:block"
          style={{ background: "linear-gradient(90deg, transparent, rgb(47 35 64 / 0.10) 48%, rgb(47 35 64 / 0.16) 50%, rgb(47 35 64 / 0.10) 52%, transparent)" }}
        />

        {/* left page: the person */}
        <div className="relative px-5 pt-6 pb-4 sm:px-8 lg:px-14 lg:pt-14 lg:pb-16">
          <div className="relative mr-auto w-[64%] max-w-[330px] lg:ml-6 lg:w-[74%]">
            <div className="settle-in photo relative" style={vars({ "--r": "-3deg", "--r0": "-7deg", "--d": "0.1s" })}>
              <Tape className="-top-3 -left-5 w-24" color="var(--color-tape-lilac)" rotate={-32} />
              <Tape className="-top-2 -right-6 w-20" color="var(--color-tape-sage)" rotate={28} />
              <img src={img("portrait-crop.webp")} alt="Ramona Nichifor" className="aspect-[4/5] w-full object-cover object-[50%_20%]" />
            </div>
          </div>

          {/* handwritten note + ink arrow pointing at the photo */}
          <div className="absolute top-[18%] right-3 w-[38%] sm:right-10 lg:top-[20%] lg:right-10 lg:w-[30%]">
            <p className="write hand text-right text-[1.4rem] sm:text-[1.8rem]" style={vars({ "--d": "0.9s", "--dur": "1.2s" })}>
              {t(words.me)}
            </p>
            <svg viewBox="0 0 120 90" className="mt-1 ml-auto w-[80%] text-hand" aria-hidden="true">
              <path
                d="M108 6 C 104 40, 70 64, 18 70"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="draw"
                pathLength={140}
                style={vars({ "--len": 140, "--d": "1.7s", "--dur": "0.8s" })}
              />
              <path
                d="M30 60 L 16 70 L 31 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="draw"
                pathLength={40}
                style={vars({ "--len": 40, "--d": "2.35s", "--dur": "0.4s" })}
              />
            </svg>
          </div>

          <div className="relative mt-8 hidden w-[42%] lg:ml-auto lg:block">
            <div className="settle-in photo" style={vars({ "--r": "4deg", "--r0": "10deg", "--d": "0.35s" })}>
              <Tape className="-top-3 left-1/2 w-20 -translate-x-1/2" color="var(--color-tape-blush)" rotate={-4} />
              <img src={img("mug.webp")} alt={t(art.pieces[1].title)} className="aspect-square w-full object-cover" />
            </div>
            <p className="hand mt-2 text-center text-[1.35rem]">{t(words.studio)}</p>
          </div>
        </div>

        {/* right page: the words */}
        <div className="relative px-5 pb-12 sm:px-8 lg:px-14 lg:pt-16 lg:pb-16">
          <h1 className="fade-up display text-[clamp(3.4rem,15vw,6.6rem)]" style={vars({ "--d": "0.2s" })}>
            Ramona <span className="italic">Nichifor</span>
          </h1>
          <p className="fade-up mt-4 max-w-[40ch] text-[1rem] italic text-ink-soft" style={vars({ "--d": "0.35s" })}>
            {t(site.roles)}
          </p>

          <p className="display mt-8 text-[clamp(1.9rem,7.6vw,2.7rem)] leading-[1.14]">
            {site.manifesto.map((line, i) => (
              <span key={`${lang}-${i}`} className="fade-up block" style={vars({ "--d": `${0.55 + i * 0.22}s` })}>
                {line[lang][0]}
                <Painted color={underline[i]} delay={1.2 + i * 0.3}>
                  {line[lang][1]}
                </Painted>
                {line[lang][2]}
              </span>
            ))}
          </p>

          <nav aria-label={t(words.contents)} className="mt-10">
            <p className="hand text-[1.6rem]">{t(words.contents)}</p>
            <ol className="mt-1">
              {chapters.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="group flex min-h-12 items-end gap-2 text-[1.12rem]">
                    <span className="display w-9 text-[1.35rem] text-hand">{c.num}</span>
                    <span className="underline-offset-4 group-hover:underline">{t(c.title)}</span>
                    <span className="leader" />
                    <span className="tabular-nums text-ink-soft">{c.page}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <PageNumber n={1} />
        </div>
      </div>
    </section>
  );
}

/** A journal page. On laptops it sits on the desk and settles flat as it scrolls in. */
function Page({ id, tilt, children }: { id: string; tilt: number; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [tilt, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  return (
    <section id={id} ref={ref} className="relative scroll-mt-4 lg:px-8 lg:py-10">
      <motion.div
        className="paper relative mx-auto max-w-5xl border-t border-dashed border-ink/20 px-5 pt-14 pb-10 sm:px-8 lg:rounded-md lg:border-0 lg:px-16 lg:pt-16 lg:page-shadow"
        style={{ rotate, y }}
      >
        {children}
      </motion.div>
    </section>
  );
}

function ChapterTitle({ id }: { id: string }) {
  const { t } = useLang();
  const c = chapters.find((x) => x.id === id)!;
  return (
    <div className="max-w-2xl">
      <h2 className="display text-[clamp(2.8rem,11vw,5rem)]">
        <span className="hand mr-3 align-[0.15em] text-[0.62em]">{c.num}.</span>
        {t(c.title)}
      </h2>
      <p className="mt-3 max-w-[46ch] text-[1.08rem] italic text-ink-soft">{t(chapterLines[id])}</p>
    </div>
  );
}

export function BooksPage() {
  const { t } = useLang();
  return (
    <Page id="carti" tilt={-1.2}>
      <ChapterTitle id="carti" />
      <div className="mt-12 grid items-start gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        <figure className="relative mx-auto w-[min(70vw,300px)]">
          <div className="relative rotate-[2deg]">
            {/* photo corners */}
            {["top-0 left-0 rotate-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map((pos) => (
              <span
                key={pos}
                className={`absolute z-10 size-7 ${pos}`}
                style={{ background: "linear-gradient(135deg, var(--color-ink-soft) 50%, transparent 50%)", opacity: 0.55 }}
                aria-hidden="true"
              />
            ))}
            <img src={img("cover-fluturele.webp")} alt={t(book.title)} className="aspect-[766/1120] w-full object-cover shadow-[0_18px_36px_-18px_rgb(47_35_64/0.55)]" />
          </div>
          <figcaption className="hand mt-4 text-center text-[1.4rem]">{t(words.cover)}</figcaption>
        </figure>
        <div className="min-w-0">
          <h3 className="display text-[clamp(2.2rem,8vw,3.4rem)]">{t(book.title)}</h3>
          <p className="mt-2 text-[1.15rem] italic text-ink-soft">{t(book.subtitle)}</p>
          <div className="mt-6 max-w-[56ch] space-y-4 text-[1.05rem]">
            {book.blurb.map((p, i) => (
              <p key={i}>{t(p)}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {book.stores.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 text-paper transition-transform duration-150 active:scale-[0.97]"
              >
                {t(ui.buyAt)} <strong className="font-semibold">{s.name}</strong>
                <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
          <p className="mt-4 text-[0.92rem] text-ink-soft">
            {t(ui.formats)} <span className="tabular-nums">ISBN {book.isbn}</span>
          </p>
          <dl className="mt-10 grid gap-x-4 gap-y-1 text-[1rem] sm:grid-cols-[auto_1fr]">
            <dt className="hand text-[1.45rem] sm:col-span-2">{t(words.forAges)}</dt>
            {ages.map((a) => (
              <div key={a.id} className="contents">
                <dt className="display text-[1.35rem]">{t(a.label)}</dt>
                <dd className="self-center text-ink-soft">{a.count ? t(a.line) : <span className="hand text-[1.3rem]">{t(words.inWorks)}</span>}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <PageNumber n={2} />
    </Page>
  );
}

export function UniversesPage() {
  const { t } = useLang();
  return (
    <Page id="universuri" tilt={1}>
      <ChapterTitle id="universuri" />
      <p className="hand mt-8 text-[1.5rem]">{t(words.specimens)}</p>
      <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
        {universes.map((u, i) => {
          const live = u.status === "available";
          return (
            <li key={u.id} className="relative">
              <div className="relative mx-auto aspect-square w-full max-w-[210px]" style={{ transform: `rotate(${[-2, 1.5, -1, 2][i]}deg)` }}>
                <span
                  className="absolute inset-[6%] rounded-full opacity-85"
                  style={{ background: `radial-gradient(circle at 42% 38%, ${u.tint[0]} 0%, ${u.tint[1]} 78%)`, filter: "url(#blot)" }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 grid place-items-center">
                  {live ? (
                    <div className="w-[66%]">
                      <Butterfly width="100%" tempo={1.6} />
                    </div>
                  ) : (
                    <Creature id={u.id as "buburuza"} size={92} style={{ color: u.tint[2] }} />
                  )}
                </div>
                {live && <Tape className="top-1 -right-2 w-16" color="var(--color-tape-lilac)" rotate={38} />}
              </div>
              <h3 className="display mt-4 text-[1.35rem] leading-tight">{t(u.name)}</h3>
              <p className="text-[0.98rem] italic text-ink-soft">{t(u.book)}</p>
              <p className="hand mt-1 text-[1.3rem]" style={{ color: live ? "var(--color-hand)" : "var(--color-ink-soft)" }}>
                {t(live ? words.available : words.soon)}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="mt-10 max-w-[58ch] text-[1.02rem] text-ink-soft">
        {t(ui.inThisUniverse)}: {universes[0].items.map((it) => t(it.name).toLowerCase()).join(", ")}.
      </p>
      <PageNumber n={3} />
    </Page>
  );
}

export function ArtPage() {
  const { t } = useLang();
  const rot = [-3, 2.5, -1.5];
  return (
    <Page id="arta" tilt={-0.8}>
      <ChapterTitle id="arta" />
      <p className="mt-4 max-w-[56ch] text-[1.05rem]">{t(art.lead)}</p>
      <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
        {art.pieces.map((p, i) => (
          <li key={p.src} className={i === 1 ? "sm:mt-12" : ""}>
            <figure className="photo relative mx-auto max-w-[300px]" style={{ transform: `rotate(${rot[i]}deg)` }}>
              <Tape className="-top-3 left-1/2 w-20 -translate-x-1/2" color={["var(--color-tape-sage)", "var(--color-tape-blush)", "var(--color-tape-lilac)"][i]} rotate={[-3, 4, -2][i]} />
              <img
                src={img(p.src)}
                alt={t(p.title)}
                className={`aspect-[4/5] w-full ${p.src.startsWith("butterfly") ? "bg-paper object-contain p-6" : "object-cover"}`}
              />
              <figcaption className="absolute inset-x-0 bottom-1.5 text-center">
                <span className="hand text-[1.35rem]">{t(p.title)}</span>
              </figcaption>
            </figure>
            <p className="mt-3 text-center text-[0.95rem] text-ink-soft">{t(p.kind)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.95rem] italic text-ink-soft">{t(ui.exampleNote)}</p>
        <a href={site.contact.whatsapp.href} target="_blank" rel="noreferrer" className="group inline-flex min-h-11 items-center gap-2 text-[1.05rem] underline decoration-hand/40 decoration-2 underline-offset-[6px]">
          {t(ui.askAboutPiece)}
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
      <PageNumber n={4} />
    </Page>
  );
}

export function CounsellingPage() {
  const { t } = useLang();
  return (
    <Page id="consiliere" tilt={1.1}>
      <ChapterTitle id="consiliere" />
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <article className="lined relative rotate-[-0.6deg] bg-[#fffdf8] px-6 pt-8 pb-10 shadow-[0_20px_44px_-24px_rgb(47_35_64/0.5)] sm:px-10">
          <Tape className="-top-3 left-8 w-24" color="var(--color-tape-sage)" rotate={-6} />
          <p className="hand text-[1.75rem]">{t(words.letterOpen)}</p>
          <h3 className="display mt-4 text-[clamp(1.9rem,7vw,2.8rem)] leading-[1.05]">{t(counselling.title)}</h3>
          <p className="mt-4 text-[1.08rem] leading-[1.85rem]">{t(counselling.lead)}</p>
          <p className="hand mt-6 text-right text-[2rem]">{words.signature}</p>
        </article>
        <div className="min-w-0">
          <ul className="space-y-5">
            {counselling.formats.map((f, i) => {
              const Icon = i === 0 ? Video : Armchair;
              return (
                <li key={i} className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border border-ink/20 text-leaf">
                    <Icon size={21} />
                  </span>
                  <span>
                    <span className="display block text-[1.5rem] leading-tight">{t(f.title)}</span>
                    <span className="text-[1rem] text-ink-soft">{t(f.line)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <a
            href={site.contact.whatsapp.href}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-6 text-paper transition-transform duration-150 active:scale-[0.97]"
          >
            <WhatsApp size={19} />
            {t(ui.writeToMe)}
          </a>
          <CopyEmail className="mt-3 text-[1rem] text-ink-soft [&_button]:border [&_button]:border-ink/20" />
        </div>
      </div>
      <PageNumber n={5} />
    </Page>
  );
}

export function LastPage() {
  const { t } = useLang();
  return (
    <footer id="contact" className="relative lg:px-8 lg:pt-6 lg:pb-16">
      <div className="paper relative mx-auto max-w-5xl border-t border-dashed border-ink/20 px-5 pt-14 pb-12 sm:px-8 lg:rounded-md lg:border-0 lg:px-16 lg:page-shadow">
        <p className="hand text-[1.6rem]">{t(words.lastPage)}</p>
        <p className="display mt-2 text-[clamp(2.8rem,12vw,5rem)]">
          Ramona <span className="italic">Nichifor</span>
        </p>
        <p className="mt-2 text-[1.15rem] italic text-ink-soft">{t(site.souls)}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Socials />
          <CopyEmail className="text-[1rem] text-ink-soft [&_button]:border [&_button]:border-ink/20" />
        </div>
        <nav aria-label={t(words.contents)} className="mt-10 flex flex-wrap gap-x-6 text-[1rem]">
          <a href="#despre" className="flex min-h-11 items-center">{t(nav.about)}</a>
          {chapters.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="flex min-h-11 min-w-11 items-center">
              {t(c.title)}
            </a>
          ))}
        </nav>
        <p className="mt-8 text-[0.85rem] text-ink-soft">© 2026 Ramona Nichifor · {t(mockupNote.placeholders)}</p>
      </div>
    </footer>
  );
}
