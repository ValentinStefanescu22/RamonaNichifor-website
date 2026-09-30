import type { CSSProperties } from "react";
import { img } from "../shared/assets";
import { Butterfly } from "../shared/Butterfly";
import type { ConceptId, Text } from "../shared/content";
import { concepts, mockupNote, universes } from "../shared/content";
import { Creature } from "../shared/creatures";
import { ArrowRight } from "../shared/icons";
import { LangToggle, useLang } from "../shared/lang";

const t2 = (ro: string, en: string): Text => ({ ro, en });

const copy = {
  title: t2("Trei direcții pentru site-ul tău", "Three directions for your website"),
  lead: t2(
    "Același conținut, spus în trei feluri. Deschide-le pe telefon: acolo le vor vedea cei mai mulți vizitatori.",
    "The same content, told three ways. Open them on your phone: that's where most visitors will see them.",
  ),
  open: t2("Deschide conceptul", "Open the concept"),
  askTitle: t2("Ce ne-ar ajuta să aflăm de la tine", "What would help us most"),
  asks: [
    t2("Care dintre ele se simte cel mai mult ca tine?", "Which one feels most like you?"),
    t2("Ce îți place la culori și fonturi? Ce ai schimba?", "What do you like about the colours and fonts? What would you change?"),
    t2("Animațiile: prea multe, prea puține sau exact cât trebuie?", "The animations: too many, too few, or just right?"),
    t2("Ai lua ceva dintr-o variantă și ai pune în alta?", "Would you move something from one concept into another?"),
  ],
  note: t2(
    "Butonul RO | EN schimbă limba pe fiecare pagină. Linkurile către magazine, adresele și unele imagini sunt provizorii.",
    "The RO | EN switch changes the language on every page. Store links, addresses and some images are placeholders.",
  ),
  me: t2("eu, între două povești", "me, between two stories"),
  chosenTitle: t2("Aleasă: Poiana · Nou: pagina Universuri", "Chosen: The Meadow · New: the Universes page"),
  chosenLine: t2(
    "Mișcarea din conceptul C, pe culorile Poianei. Atinge o lume ca s-o deschizi.",
    "Concept C's motion in the Meadow's colours. Tap a world to open it.",
  ),
};

const fonts: Record<ConceptId, CSSProperties> = {
  poiana: { fontFamily: "var(--font-meadow)", fontVariationSettings: '"SOFT" 100', fontWeight: 400, letterSpacing: "-0.02em" },
  jurnal: { fontFamily: "var(--font-journal)", fontWeight: 400 },
  universuri: { fontFamily: "var(--font-worlds)", fontWeight: 600, letterSpacing: "-0.035em", fontVariationSettings: '"wdth" 88' },
};

function Preview({ id }: { id: ConceptId }) {
  const { t } = useLang();
  if (id === "poiana")
    return (
      <div className="relative h-full overflow-hidden" style={{ background: "linear-gradient(180deg, #d6e6f5, #eef3fa 45%, #fbf7f1)" }}>
        <img
          src={img("meadow.webp")}
          alt=""
          className="absolute inset-x-0 bottom-0 h-[70%] w-full object-cover object-bottom"
          style={{ maskImage: "linear-gradient(180deg, transparent, #000 32%)", WebkitMaskImage: "linear-gradient(180deg, transparent, #000 32%)" }}
        />
        <div className="absolute top-[14%] left-1/2 w-[34%] -translate-x-1/2">
          <Butterfly width="100%" tempo={0.5} />
        </div>
      </div>
    );
  if (id === "jurnal")
    return (
      <div className="dots relative h-full overflow-hidden bg-[#f6f1ea]">
        <div className="absolute top-[12%] left-[12%] w-[42%] rotate-[-4deg] bg-[#fffdf9] p-1.5 pb-5 shadow-[0_10px_20px_-10px_rgb(47_35_64/0.5)]">
          <span className="absolute -top-2 -left-3 h-4 w-12 rotate-[-30deg] bg-[#cdbfe8]/85" />
          <img src={img("portrait-crop.webp")} alt="" className="aspect-[4/5] w-full object-cover object-[50%_20%]" />
        </div>
        <p className="absolute top-[26%] right-[8%] w-[36%] text-right text-[1.35rem] leading-tight text-[#5a3d8f]" style={{ fontFamily: "var(--font-hand)" }}>
          {t(copy.me)}
        </p>
      </div>
    );
  return (
    <div className="relative h-full overflow-hidden" style={{ background: "linear-gradient(180deg, #241b3d, #3d2f66 45%, #7d64a8 80%, #d6a9c6)" }}>
      {universes.map((u, i) => {
        const pos = [
          { left: "22%", top: "20%", size: 74 },
          { left: "60%", top: "14%", size: 52 },
          { left: "70%", top: "54%", size: 52 },
          { left: "30%", top: "60%", size: 52 },
        ][i];
        return (
          <span
            key={u.id}
            className="absolute grid place-items-center rounded-full"
            style={{
              left: pos.left,
              top: pos.top,
              width: pos.size,
              height: pos.size,
              background: `radial-gradient(circle at 36% 30%, #fff8f1, ${u.tint[0]} 30%, ${u.tint[1]} 90%)`,
              boxShadow: `0 0 30px ${u.tint[1]}`,
            }}
          >
            {u.status === "available" ? (
              <span className="w-[62%]">
                <Butterfly width="100%" flap={false} />
              </span>
            ) : (
              <Creature id={u.id as "buburuza"} size={pos.size * 0.55} style={{ color: u.tint[2] }} />
            )}
          </span>
        );
      })}
    </div>
  );
}

export default function App() {
  const { t } = useLang();
  return (
    <div className="min-h-svh px-4 pt-6 pb-16 sm:px-6 lg:pt-10">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <p className="text-[1.05rem] font-bold">Ramona Nichifor</p>
        <LangToggle id="switch" />
      </header>

      <main className="mx-auto max-w-6xl">
        <h1 className="mt-12 max-w-[16ch] text-[clamp(2.4rem,9vw,4.2rem)] leading-[1.02] font-bold tracking-[-0.02em] lg:mt-16">{t(copy.title)}</h1>
        <p className="mt-4 max-w-[52ch] text-[1.12rem] text-ink-soft">{t(copy.lead)}</p>

        <a
          href="universuri-poiana.html"
          className="group mt-8 flex items-center gap-4 rounded-[1.6rem] bg-card p-4 ring-2 ring-accent/40 transition-transform duration-300 active:scale-[0.99] sm:p-5"
        >
          <span className="grid size-14 shrink-0 place-items-center rounded-full" style={{ background: "radial-gradient(circle at 36% 30%, #fff8f1, #F8DCEB 30%, #E58FBF 90%)" }}>
            <span className="w-[62%]">
              <Butterfly width="100%" tempo={0.9} />
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[1.05rem] font-bold text-ink">{t(copy.chosenTitle)}</span>
            <span className="block text-[0.98rem] text-ink-soft">{t(copy.chosenLine)}</span>
          </span>
          <ArrowRight size={20} className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1" />
        </a>

        <ul className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-14 lg:gap-6">
          {concepts.map((c) => (
            <li key={c.id}>
              <a
                href={c.href}
                className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-card ring-1 ring-line transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_26px_50px_-28px_rgb(45_35_64/0.45)] active:scale-[0.99]"
              >
                <div className="aspect-[4/3] w-full">
                  <Preview id={c.id} />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-baseline gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-[1rem] font-bold text-paper">{c.letter}</span>
                    <span className="text-[2.1rem] leading-none text-ink" style={fonts[c.id]}>
                      {t(c.name)}
                    </span>
                  </p>
                  <p className="mt-4 text-[1.02rem] text-ink-soft">{t(c.line)}</p>
                  <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 font-bold text-accent">
                    {t(copy.open)}
                    <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <section className="mt-16 grid gap-8 border-t border-line pt-12 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-[1.8rem] leading-tight font-bold">{t(copy.askTitle)}</h2>
          <ol className="space-y-4">
            {copy.asks.map((a, i) => (
              <li key={i} className="flex gap-4 text-[1.1rem]">
                <span className="grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-line text-[0.95rem] font-bold text-ink-soft tabular-nums">{i + 1}</span>
                <span className="pt-0.5">{t(a)}</span>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-14 max-w-[60ch] text-[0.95rem] text-ink-soft">{t(copy.note)}</p>
        <p className="mt-2 text-[0.85rem] text-ink-soft">
          {t(mockupNote.chip)} · 2026
        </p>
      </main>
    </div>
  );
}
