import { useEffect, useState, type SVGProps } from "react";
import { AnimatePresence, motion } from "motion/react";
import { img } from "../shared/assets";
import { ages, art, book, counselling, mockupNote, nav, pillars, site, ui } from "../shared/content";
import { CopyEmail } from "../shared/CopyEmail";
import { ArrowRight, ArrowUpRight, Brush, Facebook, Instagram, OpenBook, Sprout, WhatsApp } from "../shared/icons";
import { LangToggle, useLang } from "../shared/lang";
import { easeOut, spring } from "../shared/motion";

// Navigation lives in the dock at every size; the header only carries the name and language.
export function Header() {
  return (
    <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-4 sm:px-6 lg:pt-6">
      <a href="#top" className="display inline-flex min-h-11 items-center text-[1.4rem] font-semibold text-cream" style={{ fontVariationSettings: '"wdth" 80' }}>
        Ramona Nichifor
      </a>
      <LangToggle id="head" />
    </header>
  );
}

const OrbitIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="19" cy="6" r="1.6" />
    <circle cx="5.5" cy="18" r="1.3" />
    <path d="M17.6 7.3a8 8 0 0 1-9.8 11M6.6 16.8A8 8 0 0 1 16 5.4" strokeDasharray="1.5 2.6" />
  </svg>
);

const tabs = [
  { id: "universuri", label: nav.universes, Icon: OrbitIcon },
  { id: "carti", label: nav.books, Icon: OpenBook },
  { id: "arta", label: nav.art, Icon: Brush },
  { id: "consiliere", label: nav.counselling, Icon: Sprout },
];

/** Bottom tab bar on phones, a floating dock on laptops. Tracks the section in view. */
export function Dock() {
  const { t } = useLang();
  const [active, setActive] = useState("universuri");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    tabs.forEach((tab) => {
      const el = document.getElementById(tab.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label={t(nav.menu)}
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center lg:bottom-5"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex w-full items-stretch justify-around bg-night/80 px-2 pt-1.5 pb-1.5 text-lilac-soft shadow-[0_-8px_30px_-12px_rgb(36_27_61/0.5)] ring-1 ring-white/10 backdrop-blur-xl backdrop-saturate-150 lg:w-auto lg:gap-1 lg:rounded-full lg:px-2">
        {tabs.map(({ id, label, Icon }) => {
          const on = active === id;
          return (
            <li key={id} className="flex-1 lg:flex-none">
              <a
                href={`#${id}`}
                aria-current={on ? "true" : undefined}
                className="relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-3 text-[0.72rem] font-bold transition-colors duration-300 lg:min-h-12 lg:flex-row lg:gap-2 lg:rounded-full lg:px-5 lg:text-[0.9rem]"
                style={{ color: on ? "var(--color-night)" : undefined }}
              >
                {on && (
                  <motion.span layoutId="dock-pill" className="absolute inset-x-1 inset-y-0.5 -z-10 rounded-2xl bg-cream lg:inset-0 lg:rounded-full" transition={spring} />
                )}
                <Icon width={22} height={22} />
                <span>{t(label)}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function BooksByAge() {
  const { t } = useLang();
  const [age, setAge] = useState<(typeof ages)[number]["id"]>("copii");
  const current = ages.find((a) => a.id === age)!;
  return (
    <section id="carti" className="scroll-mt-4 bg-dawn px-4 pt-20 pb-24 sm:px-6 lg:pt-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="display text-[clamp(2.6rem,10vw,4.8rem)] font-semibold text-ink">{t(nav.books)}</h2>
        <p className="mt-3 max-w-[46ch] text-[1.08rem] text-ink-soft">{t(pillars.books.line)}</p>

        <div role="tablist" aria-label={t(nav.books)} className="mt-8 inline-flex w-full max-w-md rounded-full bg-lilac-soft/70 p-1.5 sm:w-auto">
          {ages.map((a) => {
            const on = a.id === age;
            return (
              <button
                key={a.id}
                role="tab"
                id={`tab-${a.id}`}
                aria-selected={on}
                aria-controls="age-panel"
                onClick={() => setAge(a.id)}
                className="relative min-h-11 flex-1 rounded-full px-4 text-[0.98rem] font-bold transition-colors duration-300 sm:flex-none sm:px-6"
                style={{ color: on ? "var(--color-cream)" : "var(--color-ink-soft)" }}
              >
                {on && <motion.span layoutId="age-pill" className="absolute inset-0 -z-10 rounded-full bg-night" transition={spring} />}
                <span className="relative">{t(a.label)}</span>
              </button>
            );
          })}
        </div>

        <div id="age-panel" role="tabpanel" aria-labelledby={`tab-${age}`} className="mt-8 min-h-[280px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={age}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: easeOut }}
            >
              {current.count > 0 ? (
                <article className="grid items-center gap-6 rounded-[2rem] bg-cream p-5 shadow-[0_24px_50px_-30px_rgb(36_27_61/0.45)] ring-1 ring-ink/5 sm:grid-cols-[180px_1fr] sm:p-7 lg:grid-cols-[220px_1fr] lg:gap-10">
                  <img src={img("cover-fluturele.webp")} alt={t(book.title)} className="mx-auto w-40 rounded-[6px] shadow-[0_18px_30px_-14px_rgb(36_27_61/0.55)] sm:w-full" />
                  <div className="min-w-0">
                    <p className="text-[0.92rem] font-bold text-violet">
                      „{t(site.series)}” · {book.year}
                    </p>
                    <h3 className="display mt-2 text-[clamp(1.9rem,7vw,2.8rem)] font-semibold text-ink">{t(book.title)}</h3>
                    <p className="mt-2 text-[1.05rem] text-ink-soft italic">{t(book.subtitle)}</p>
                    <p className="mt-4 max-w-[58ch] text-[1rem] text-ink-soft">{t(book.blurb[0])}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {book.stores.map((s) => (
                        <a
                          key={s.name}
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-night px-5 font-bold text-cream transition-transform active:scale-[0.97]"
                        >
                          {t(ui.buyAt)} {s.name}
                          <ArrowUpRight size={17} />
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ) : (
                <div className="grid min-h-[240px] place-items-center rounded-[2rem] border-2 border-dashed border-lilac px-6 py-10 text-center">
                  <div>
                    <OpenBook size={34} className="mx-auto text-violet" />
                    <p className="display mt-4 text-[1.8rem] font-semibold text-ink">{t(ui.comingSoon)}</p>
                    <p className="mt-2 text-ink-soft">{t(current.line)}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export function ArtAndCounselling() {
  const { t } = useLang();
  return (
    <div className="bg-dawn px-4 pb-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2 lg:gap-6">
        <section id="arta" className="scroll-mt-4 rounded-[2.2rem] bg-white/50 p-1.5 ring-1 ring-ink/5">
          <div className="flex h-full flex-col overflow-hidden rounded-[calc(2.2rem-0.375rem)] bg-cream">
            <div className="relative grid h-64 grid-cols-[1.3fr_1fr] grid-rows-1 gap-1.5 p-1.5 sm:h-80">
              <img src={img("cover-fluturele.webp")} alt={t(art.pieces[0].title)} className="h-full min-h-0 w-full rounded-[1.4rem] object-cover object-[50%_75%]" />
              <img src={img("mug.webp")} alt={t(art.pieces[1].title)} className="h-full min-h-0 w-full rounded-[1.4rem] object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex items-center gap-2 text-violet">
                <Brush size={20} />
                <h2 className="display text-[2.4rem] font-semibold text-ink">{t(art.title)}</h2>
              </div>
              <p className="mt-2 max-w-[44ch] text-[1.02rem] text-ink-soft">{t(art.lead)}</p>
              <p className="mt-3 text-[0.9rem] text-ink-soft italic">{t(ui.exampleNote)}</p>
              <a href={site.contact.whatsapp.href} target="_blank" rel="noreferrer" className="group mt-auto inline-flex min-h-12 items-center gap-2 self-start pt-5 font-bold text-violet">
                {t(ui.askAboutPiece)}
                <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>

        <section id="consiliere" className="scroll-mt-4 rounded-[2.2rem] bg-white/50 p-1.5 ring-1 ring-ink/5">
          <div className="flex h-full flex-col overflow-hidden rounded-[calc(2.2rem-0.375rem)] bg-sage">
            <div className="relative h-64 overflow-hidden p-1.5 sm:h-80">
              <img src={img("portrait-crop.webp")} alt="Ramona Nichifor" className="h-full w-full rounded-[1.4rem] object-cover object-[50%_25%]" />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex items-center gap-2 text-[#56704a]">
                <Sprout size={20} />
                <h2 className="display text-[2.4rem] font-semibold text-ink">{t(nav.counselling)}</h2>
              </div>
              <p className="mt-2 max-w-[44ch] text-[1.02rem] text-ink-soft">{t(counselling.lead)}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {counselling.formats.map((f, i) => (
                  <li key={i} className="rounded-full bg-cream/80 px-3.5 py-1.5 text-[0.9rem] font-bold text-ink">
                    {t(f.title)}
                  </li>
                ))}
              </ul>
              <a
                href={site.contact.whatsapp.href}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-12 items-center gap-2.5 self-start rounded-full bg-night py-1.5 pr-1.5 pl-5 font-bold text-cream transition-transform active:scale-[0.97]"
              >
                {t(ui.bookConversation)}
                <span className="grid size-9 place-items-center rounded-full bg-cream/15">
                  <WhatsApp size={18} />
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function About() {
  const { t, lang } = useLang();
  return (
    <section id="despre" className="scroll-mt-4 bg-dawn px-4 pb-24 sm:px-6">
      <div className="mx-auto max-w-6xl border-t border-lilac pt-16">
        <h2 className="sr-only">{t(nav.about)}</h2>
        <blockquote className="display max-w-[18ch] text-[clamp(2rem,7.5vw,3.8rem)] font-medium text-ink">
          {site.manifesto.map((line, i) => (
            <span key={i} className="block">
              {line[lang][0]}
              <span className="text-violet">{line[lang][1]}</span>
              {line[lang][2]}
            </span>
          ))}
        </blockquote>
        <div className="mt-8 flex items-center gap-4">
          <img src={img("portrait-crop.webp")} alt="" className="size-16 rounded-full object-cover object-[50%_20%]" />
          <div className="min-w-0">
            <p className="font-bold text-ink">Ramona Nichifor</p>
            <p className="text-[0.95rem] text-ink-soft">{t(site.roles)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLang();
  const socials = [
    { label: "Instagram", href: site.contact.instagram.href, Icon: Instagram },
    { label: "Facebook", href: site.contact.facebook.href, Icon: Facebook },
    { label: "WhatsApp", href: site.contact.whatsapp.href, Icon: WhatsApp },
  ];
  return (
    <footer id="contact" className="bg-night px-4 pt-16 pb-36 text-lilac-soft sm:px-6 lg:pb-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="display text-[clamp(2.4rem,10vw,4.4rem)] font-semibold text-cream">Ramona Nichifor</p>
          <p className="mt-2 text-[1.05rem]">{t(site.souls)}</p>
        </div>
        <div className="flex flex-col gap-3">
          <ul className="flex gap-2">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-11 place-items-center rounded-full ring-1 ring-white/20 transition-colors hover:bg-cream hover:text-night">
                  <Icon size={19} />
                </a>
              </li>
            ))}
          </ul>
          <CopyEmail className="text-[0.98rem] [&_button]:bg-white/10 [&_button]:text-cream" />
          <LangToggle id="foot" />
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-[0.85rem] opacity-80">© 2026 Ramona Nichifor · {t(mockupNote.placeholders)}</p>
    </footer>
  );
}
