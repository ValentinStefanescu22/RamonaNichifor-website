import { useEffect, useState } from "react";
import { img } from "../../shared/assets";
import { book, site, ui, universes } from "../../shared/content";
import { bookPage, booksPage, shelf, type ShelfBook } from "../../shared/content-pages";
import { ArrowRight, ArrowUpRight, Instagram } from "../../shared/icons";
import { useLang } from "../../shared/lang";
import { delay, PillLink, SiteShell, TextLink } from "../../site/Layout";
import { BookCover, Wash } from "../../site/Painted";
import { OrbArt } from "../../universuri/WorldMap";
import { StatusChip } from "../../site/StatusChip";

/** The cover is hinged at the spine: it opens a little on hover or tap, showing the first page */
function OpeningCover({ b }: { b: ShelfBook }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const hinge = `relative origin-left transition-transform duration-700 ease-(--ease-bloom) group-hover:[transform:rotateY(-24deg)] ${
    open ? "[transform:rotateY(-24deg)]" : "[transform:rotateY(0deg)_rotateZ(-1.5deg)]"
  }`;
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-pressed={open}
      aria-label={t(b.title)}
      className="group relative mx-auto block w-[min(70vw,360px)] [perspective:1400px] lg:w-[400px]"
    >
      {/* the first page waiting under the cover */}
      <span className="absolute inset-0 translate-x-[3%] rounded-r-[8px] bg-[#fffaf3] shadow-soft" aria-hidden="true">
        <span className="absolute inset-x-[16%] top-[22%] flex flex-col gap-2.5 opacity-40">
          {[92, 80, 88, 60].map((w, i) => (
            <span key={i} className="h-[3px] rounded-full bg-ink-soft" style={{ width: `${w}%` }} />
          ))}
        </span>
      </span>
      {b.cover ? (
        <img src={img(b.cover)} alt="" className={`shadow-book aspect-[766/1120] w-full rounded-r-[10px] rounded-l-[4px] object-cover ${hinge}`} />
      ) : (
        <div className={hinge} aria-hidden="true">
          <BookCover book={b} />
        </div>
      )}
    </button>
  );
}

// One page for every book, chosen by the link's #id (carte.html#buburuza); no id means the Fluture book
const pick = (): ShelfBook => shelf.find((b) => b.id === window.location.hash.slice(1)) ?? shelf[0];

export default function App() {
  const { t } = useLang();
  const [b, setB] = useState(pick);
  useEffect(() => {
    const onHash = () => {
      setB(pick());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    document.title = `${t(b.title)} · Ramona Nichifor`;
  }, [b, t]);

  const live = b.status === "available";
  const u = b.universe ? universes.find((x) => x.id === b.universe) : undefined;
  const related = shelf.filter((x) => x.id !== b.id && (b.universe ? Boolean(x.universe) : x.age === b.age));
  const blurb = live ? book.blurb : [u ? u.hook : b.line, bookPage.placeholderBlurb];
  const meta = live
    ? bookPage.meta
    : [
        { label: bookPage.meta[0].label, value: bookPage.ageRange[b.age] },
        { label: bookPage.meta[1].label, value: bookPage.toBeAnnounced },
        { label: bookPage.meta[3].label, value: bookPage.toBeAnnounced },
      ];
  return (
    <SiteShell current="carti" ground="cream" floatAfter={0.6}>
      <main>
        <section className="relative isolate overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:pt-32 lg:pb-24" style={{ background: "linear-gradient(180deg, #f9e8ef 0%, var(--color-petal) 55%, var(--color-cream) 100%)" }}>
          <div className="mx-auto max-w-6xl">
            <a href="carti.html" className="inline-flex min-h-11 items-center gap-2 font-medium text-ink-soft hover:text-ink">
              <ArrowRight size={17} className="rotate-180" />
              {t(bookPage.back)}
            </a>
            <div className="mt-6 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <div className="fade-up" style={delay(0.1)}>
                <OpeningCover key={b.id} b={b} />
              </div>
              <div className="min-w-0">
                <h1 className="rise display text-[clamp(2.6rem,10vw,4.6rem)] font-[380] text-ink" style={delay(0.2)}>
                  {t(b.title)}
                </h1>
                <p className="fade-up display mt-3 text-[1.35rem] leading-snug italic text-ink-soft" style={delay(0.3)}>
                  {t(live ? book.subtitle : b.line)}
                </p>
                <p className="fade-up mt-4 flex flex-wrap items-center gap-2 text-[0.95rem] text-ink-soft" style={delay(0.35)}>
                  <StatusChip live={live}>{t(booksPage.status[b.status])}</StatusChip>
                  {b.universe && <>„{t(site.series)}”</>}
                </p>
                <div className="fade-up mt-6 max-w-[58ch] space-y-4 text-[1.06rem] leading-[1.75] text-ink-soft" style={delay(0.4)}>
                  {blurb.map((p, i) => (
                    <p key={i}>{t(p)}</p>
                  ))}
                </div>
                {live ? (
                <div className="fade-up mt-8 flex flex-wrap gap-3" style={delay(0.5)}>
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
                      <span className="grid size-9 place-items-center rounded-full bg-cream/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <ArrowUpRight size={17} />
                      </span>
                    </a>
                  ))}
                </div>
                ) : (
                  <div className="fade-up mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" style={delay(0.5)}>
                    <PillLink href={site.contact.instagram.href} external icon={<Instagram size={18} />}>
                      {t(ui.notifyMe)}
                    </PillLink>
                    <TextLink href="contact.html#carte">{t(ui.writeToMe)}</TextLink>
                  </div>
                )}
                {live && <p className="mt-4 text-[0.92rem] text-ink-soft">{t(ui.formats)}</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cream px-4 py-14 sm:px-6">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-6 border-y border-ink/10 py-8 sm:grid-cols-3 lg:grid-cols-5">
            {meta.map((m) => (
              <div key={m.label.ro}>
                <dt className="text-[0.9rem] text-ink-soft">{t(m.label)}</dt>
                <dd className="mt-1 font-medium text-ink tabular-nums">{t(m.value)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* PLACEHOLDER spreads: painted stand-ins until the real pages are scanned */}
        <section className="bg-cream pb-16">
          <div className="mx-auto max-w-[75rem] px-4 sm:px-6">
            <h2 className="display text-[clamp(2rem,7vw,3rem)] font-[380] text-ink">{t(bookPage.leaf)}</h2>
            <p className="mt-2 text-ink-soft">{t(bookPage.leafNote)}</p>
          </div>
          <ul className="snap-row mt-8 flex gap-5 overflow-x-auto px-[max(1rem,calc((100vw-72rem)/2))] sm:px-[max(1.5rem,calc((100vw-72rem)/2))] pb-4">
            {(
              [
                ["#fbe3c9", "#f3b9c9", "#c9b8e6"],
                ["#dce9f6", "#97bce0", "#f6dde6"],
                ["#dfe7d4", "#a9be95", "#f3c9dc"],
              ] as [string, string, string][]
            ).map((wash, i) => (
              <li key={i} className="w-[82vw] max-w-[520px] shrink-0">
                <Wash colors={wash} seed={`spread-${i}`} className="aspect-[1.45] rounded-[6px] shadow-soft">
                  <span className="absolute inset-y-0 left-1/2 w-[6%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgb(52_34_74/0.1)] to-transparent" aria-hidden="true" />
                </Wash>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-cream px-4 pb-24 sm:px-6">
          <div className={`mx-auto grid max-w-6xl gap-12 ${u ? "lg:grid-cols-[0.8fr_1.2fr] lg:gap-20" : ""}`}>
            {u && (
              <a href={`universuri.html#${u.id}`} className="group flex items-center gap-6 self-start rounded-[2rem] p-6 ring-1 ring-ink/5" style={{ background: `color-mix(in oklab, ${u.tint[0]} 60%, white)` }}>
                <OrbArt u={u} size={112} className="shrink-0 transition-transform duration-500 group-hover:scale-[1.04]" />
                <span className="min-w-0">
                  <span className="block text-[0.95rem] text-ink-soft">{t(bookPage.universe)}</span>
                  <span className="display mt-1 block text-[1.6rem] leading-tight text-ink">{t(u.name)}</span>
                  <span className={`mt-2 inline-flex min-h-11 items-center gap-1.5 font-semibold ${live ? "text-magenta" : "text-ink-soft"}`}>
                    {t(ui.discover)}
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </span>
              </a>
            )}
            {related.length > 0 && (
              <div className="min-w-0">
                <h2 className="display text-[1.9rem] text-ink">{t(b.universe ? bookPage.series : bookPage.moreBooks)}</h2>
                <ul className="mt-5 grid grid-cols-3 gap-4 sm:gap-6 lg:max-w-3xl">
                  {related.slice(0, 3).map((r) => (
                    <li key={r.id}>
                      <a href={r.href} className="group block">
                        <div className="transition-transform duration-500 ease-(--ease-bloom) group-hover:-translate-y-1.5">
                          <BookCover book={r} />
                        </div>
                        <p className="display mt-3 text-[1rem] leading-tight text-ink sm:text-[1.1rem]">{t(r.title)}</p>
                        <p className="mt-1 text-[0.85rem] text-ink-soft">{t(booksPage.status[r.status])}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
