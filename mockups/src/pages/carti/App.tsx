import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ages, book, nav, site, ui } from "../../shared/content";
import { booksPage, shelf, type AgeId, type ShelfBook } from "../../shared/content-pages";
import { ArrowRight, ArrowUpRight } from "../../shared/icons";
import { useLang } from "../../shared/lang";
import { PageOpener, SiteShell } from "../../site/Layout";
import { BookCover } from "../../site/Painted";
import { StatusChip } from "../../site/StatusChip";

function CoverStack() {
  const fan = [shelf[4], shelf[1], shelf[0]];
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
          <StatusChip live={b.status === "available"}>{t(booksPage.status[b.status])}</StatusChip>
          {b.year && <span className="text-[0.88rem] text-ink-soft tabular-nums">{b.year}</span>}
        </div>
        {href && (
          <span className={`mt-1 inline-flex min-h-11 items-center gap-1.5 font-semibold ${b.status === "available" ? "text-magenta" : "text-ink-soft"}`}>
            {t(ui.aboutBook)}
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </>
  );
  return <li>{href ? <a href={href} className="group block">{body}</a> : <div className="group">{body}</div>}</li>;
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
            <span className="text-[0.8rem] tabular-nums opacity-70">{count}</span>
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
          lead={<p>{t(booksPage.formats)}</p>}
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
                    <p className="text-[1.05rem] text-ink-soft">{t(ageLine)}</p>
                  )}
                  <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
                    {books.map((b) => (
                      <ShelfItem key={b.id} b={b} />
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="bg-cream px-4 pb-20 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 border-t border-ink/10 pt-10 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="display text-[1.8rem] text-ink">{t(booksPage.where)}</h2>
            <div className="flex flex-wrap gap-3">
              {book.stores.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-5 font-medium text-cream shadow-soft transition-transform duration-150 active:scale-[0.97]"
                >
                  <span>
                    {t(ui.buyAt)} <strong className="font-bold">{s.name}</strong>
                  </span>
                  <span className="grid size-9 place-items-center rounded-full bg-cream/15">
                    <ArrowUpRight size={17} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
