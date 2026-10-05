import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ages, nav, site, ui } from "../../shared/content";
import { booksPage, shelf, type AgeId, type ShelfBook } from "../../shared/content-pages";
import { img } from "../../shared/assets";
import { ArrowRight } from "../../shared/icons";
import { useLang } from "../../shared/lang";
import { BuySoon, PageOpener, Reveal, SiteShell, TextLink } from "../../site/Layout";
import { BookCover } from "../../site/Painted";
import { StatusChip } from "../../site/StatusChip";

function CoverStack() {
  const fan = [shelf[2], shelf[1], shelf[0]];
  const pose = [
    "left-[2%] top-[10%] -rotate-[9deg]",
    "right-[0%] top-[4%] rotate-[8deg]",
    "left-1/2 top-0 -translate-x-1/2 -rotate-[1.5deg]",
  ];
  return (
    <div className="relative mx-auto aspect-[1.05] w-[min(84vw,440px)]" aria-hidden="true">
      {fan.map((b, i) => (
        <div key={b.id} className={`absolute w-[52%] ${pose[i]}`}>
          <BookCover book={b} />
        </div>
      ))}
    </div>
  );
}

function ShelfItem({ b }: { b: ShelfBook }) {
  const { t } = useLang();
  const href = b.href;
  const body = (
    <>
      <div className="relative px-[6%]">
        <div className="transition-transform duration-500 ease-(--ease-bloom) group-hover:-translate-y-2 group-hover:-rotate-[1.5deg]">
          <BookCover book={b} />
        </div>
        {/* it stands on the shelf: a soft contact shadow */}
        <span className="mx-auto mt-1 block h-3 w-[96%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(52_34_74/0.22),transparent)]" aria-hidden="true" />
      </div>
      <div className="mt-3 px-1">
        <h3 className="display text-[1.25rem] leading-tight text-ink">{t(b.title)}</h3>
        <p className="mt-1 text-[0.95rem] leading-snug text-ink-soft">{t(b.line)}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <StatusChip tint={b.status === "published" ? b.tint[2] : undefined}>{t(booksPage.status[b.status])}</StatusChip>
          {b.year && <span className="text-[0.88rem] text-ink-soft tabular-nums">{b.year}</span>}
        </div>
        {href && (
          <span className={`mt-1 inline-flex min-h-11 items-center gap-1.5 font-semibold underline decoration-lilac decoration-2 underline-offset-[6px] ${b.status === "published" ? "text-ink" : "text-ink-soft"}`}>
            {t(ui.aboutBook)}
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </>
  );
  return <li>{href ? <a href={href} className="group block">{body}</a> : <div className="group">{body}</div>}</li>;
}

/** „Despre autor”, the last word before the footer: the books first, then the person behind them */
function AboutAuthor() {
  const { t } = useLang();
  const a = booksPage.author;
  const [first, ...rest] = a.paragraphs;
  const name = "Ramona Nichifor";
  return (
    <section aria-labelledby="despre-autor" className="relative overflow-hidden bg-cream px-4 pb-16 sm:px-6 lg:pb-20">
      <div className="mx-auto grid max-w-6xl items-start gap-10 pt-6 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20 lg:pt-10">
        <Reveal i={0} className="relative mx-auto w-[min(58vw,260px)] pt-4 lg:sticky lg:top-28 lg:mx-0 lg:w-full lg:max-w-[300px]">
          <span className="paint-edge absolute -inset-x-3 top-1 -bottom-3 rounded-[999px_999px_2.5rem_2.5rem] bg-petal" aria-hidden="true" />
          <img src={img("portrait.webp")} alt="Ramona Nichifor" loading="lazy" className="arch relative aspect-[4/5] w-full object-cover object-[50%_22%]" />
        </Reveal>
        <div className="max-w-[58ch]">
          <Reveal i={0}>
            <h2 id="despre-autor" className="display text-[clamp(2.2rem,8.5vw,3.6rem)] font-[380] text-ink">
              {t(a.title)}
            </h2>
          </Reveal>
          <div className="mt-6 space-y-5 text-[1.08rem] leading-[1.65] text-ink">
            <Reveal i={1}>
              <p className="text-[1.2rem] leading-[1.65] text-ink">
                {/* her name opens the text in her own weight, as on the printed page */}
                <strong className="font-bold">{name}</strong>
                {t(first).slice(name.length)}
              </p>
            </Reveal>
            {rest.map((p, i) => (
              <Reveal key={i} i={i + 2}>
                <p>{t(p)}</p>
              </Reveal>
            ))}
            <Reveal i={2}>
              <p className="display !mt-9 text-[clamp(1.45rem,4.6vw,1.9rem)] leading-[1.25] font-[360] text-violet italic text-balance">{t(a.statement)}</p>
            </Reveal>
          </div>
          <TextLink href="despre.html" className="mt-6">
            {t(ui.myStory)}
          </TextLink>
        </div>
      </div>
    </section>
  );
}

/** Copii · Adolescenți · Adulți as tabs: the pill slides with a critically damped spring */
function AgeTabs({ value, onChange }: { value: AgeId; onChange: (a: AgeId) => void }) {
  const { t } = useLang();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const onKey = (e: KeyboardEvent) => {
    const i = ages.findIndex((a) => a.id === value);
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? ages.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const a = ages[(next + ages.length) % ages.length];
    onChange(a.id);
    refs.current[a.id]?.focus();
  };
  return (
    <div role="tablist" aria-label={t(nav.books)} onKeyDown={onKey} className="inline-flex rounded-full bg-white/60 p-1 ring-1 ring-ink/8 backdrop-blur-sm">
      {ages.map((a) => {
        const on = a.id === value;
        const count = shelf.filter((b) => b.age === a.id).length;
        return (
          <button
            key={a.id}
            ref={(el) => {
              refs.current[a.id] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${a.id}`}
            aria-selected={on}
            aria-controls="shelf"
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(a.id)}
            className="relative z-0 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.98rem] font-medium transition-colors duration-300 sm:px-5"
            style={{ color: on ? "var(--color-cream)" : "var(--color-ink-soft)" }}
          >
            {on && <motion.span layoutId="age-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ type: "spring", bounce: 0, duration: 0.4 }} />}
            {t(a.label)}
            {count > 0 && <span className="text-[0.8rem] tabular-nums opacity-70">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const { t } = useLang();
  const [age, setAge] = useState<AgeId>("copii");
  const books = shelf.filter((b) => b.age === age);
  const ageLine = ages.find((a) => a.id === age)!.line;
  return (
    <SiteShell current="carti" ground="cream">
      <main>
        <PageOpener
          title={t(nav.books)}
          tagline={t(site.souls)}
          lead={<p>{t(site.whisper)}</p>}
          background="linear-gradient(180deg, #f9e8ef 0%, var(--color-petal) 46%, var(--color-cream) 96%)"
          aside={<CoverStack />}
        />

        <section className="bg-cream px-4 pt-6 pb-20 sm:px-6 lg:pb-28">
          <div className="mx-auto max-w-6xl">
            <AgeTabs value={age} onChange={setAge} />
            <div id="shelf" role="tabpanel" aria-labelledby={`tab-${age}`} className="mt-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={age}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {age === "copii" ? (
                    <p className="display text-[1.35rem] italic text-violet">„{t(site.series)}”</p>
                  ) : (
                    <p className="flex flex-wrap items-center gap-3 text-[1.05rem] text-ink-soft">
                      <StatusChip>{t(ui.inProgress)}</StatusChip>
                      {t(ageLine)}
                    </p>
                  )}
                  {books.length > 0 && <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
                    {books.map((b) => (
                      <ShelfItem key={b.id} b={b} />
                    ))}
                  </ul>}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="bg-cream px-4 pb-20 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-6 border-y border-ink/10 py-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
            <h2 className="display text-[1.8rem] text-ink">{t(booksPage.where)}</h2>
            <div className="space-y-4">
              <BuySoon />
              {/* her own sentences already say „în curând” and „planificată” */}
              <dl className="grid gap-x-8 gap-y-3 text-[1rem] sm:grid-cols-[auto_1fr]">
                {booksPage.author.formats.map((f) => (
                  <div key={f.name.ro} className="contents">
                    <dt className="font-bold text-ink">{t(f.name)}</dt>
                    <dd className="max-w-[52ch] text-ink-soft">{t(f.line)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
        <AboutAuthor />
      </main>
    </SiteShell>
  );
}
