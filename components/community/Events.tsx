"use client";
import Image from "next/image";
import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/page/Reveal";
import { StatusChip } from "@/components/ui/StatusChip";
import { TextLink } from "@/components/ui/links";
import { Brush, Calendar, ChevronDown, MapPin, OpenBook, Pen, Speech } from "@/components/ui/icons";
import type { CommunityEvent } from "@/content/types";

const look = {
  "atelier-pictura": { Icon: Brush, tint: "#e6dcf5" },
  lansare: { Icon: OpenBook, tint: "#f3c9dc" },
  autografe: { Icon: Pen, tint: "#fbe1da" },
  "atelier-citit": { Icon: Speech, tint: "#c8daf0" },
} as const;

/** Romania's clock whatever the server's or the visitor's */
const fmt = (iso: string, locale: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale === "ro" ? "ro-RO" : "en-GB", { ...o, timeZone: "Europe/Bucharest" }).format(new Date(iso));

function Row({ e, i, open: startOpen, notifyHref }: { e: CommunityEvent; i: number; open: boolean; notifyHref: string }) {
  const t = useTranslations("community");
  const locale = useLocale();
  const [open, setOpen] = useState(startOpen);
  const id = useId();
  const { Icon, tint } = look[e.kind];
  return (
    <li className="border-b border-ink/12">
      {/* only the heading settles in: a tall open panel inside the scroll-driven reveal is still moving right after a scroll */}
      <Reveal i={i}>
        <h3>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen(!open)}
            className="grid w-full cursor-pointer grid-cols-[4.5rem_1fr_auto] items-center gap-x-5 py-6 text-left sm:grid-cols-[5.5rem_1fr_auto] sm:gap-x-8"
          >
            {e.startsAt ? (
              // a dated gathering shows its day instead of the kind's picture
              <span className="grid aspect-square place-items-center content-center rounded-2xl bg-ink text-cream" aria-hidden="true">
                <span className="display text-[1.9rem] leading-none">{fmt(e.startsAt, locale, { day: "numeric" })}</span>
                <span className="mt-1 text-[0.8rem] tracking-[0.1em] uppercase">{fmt(e.startsAt, locale, { month: "short" }).replace(".", "")}</span>
              </span>
            ) : (
              <span className="relative grid aspect-square place-items-center" aria-hidden="true">
                <span className="paint-edge absolute inset-0 rounded-full opacity-80" style={{ background: tint }} />
                <Icon size={30} className="relative text-ink" />
              </span>
            )}
            <span className="min-w-0">
              <span data-title className="display block text-[clamp(1.35rem,4.8vw,1.7rem)] leading-tight text-ink">{e.title}</span>
              <span className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[0.95rem] text-ink-soft">
                <span className="font-semibold text-violet">{t(`kind.${e.kind}`)}</span>
                {e.startsAt ? (
                  <>
                    <time dateTime={e.startsAt}>{fmt(e.startsAt, locale, { hour: "2-digit", minute: "2-digit", hour12: false })}</time>
                    {e.place && <span>{e.place}</span>}
                    {e.online && <span>{t("online")}</span>}
                  </>
                ) : (
                  <StatusChip>{t("datesSoon")}</StatusChip>
                )}
              </span>
            </span>
            <ChevronDown size={22} className={`text-ink transition-transform duration-300 ease-(--ease-bloom) motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
          </button>
        </h3>
      </Reveal>
      {/* the panel folds by its grid row; closed, it is inert (no focus, out of the accessibility tree) */}
      <div
        id={id}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-(--ease-bloom) motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-6 pb-8 sm:pl-[7.5rem]">
            {e.image && (
              // her poster, whole
              <Image src={e.image.src} alt={e.image.alt} width={e.image.width} height={e.image.height} sizes="11rem" className="block h-auto w-44 rounded-xl" />
            )}
            <div className="min-w-0 flex-1 basis-64 space-y-3 text-[1rem] text-ink-soft">
              {e.audience && <p className="max-w-[46ch]">{e.audience}</p>}
              {e.startsAt ? (
                <>
                  <p className="flex items-center gap-2.5 text-ink">
                    <Calendar size={20} className="shrink-0 text-violet" />
                    <span className="first-letter:uppercase">
                      {fmt(e.startsAt, locale, { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}
                    </span>
                  </p>
                  {e.place && (
                    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-ink">
                      <MapPin size={20} className="shrink-0 text-violet" />
                      {e.place}
                      <a
                        href={`https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query: e.place })}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-6 items-center text-ink-soft underline decoration-lilac underline-offset-4 hover:text-ink"
                      >
                        {t("onMap")}
                      </a>
                    </p>
                  )}
                  {e.signUpNote && <p className="max-w-[46ch]">{e.signUpNote}</p>}
                </>
              ) : (
                <TextLink href={notifyHref} external>
                  {t("notify")}
                </TextLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/** What we do together: one row per gathering, each opening to its details. Dated ones come first and show their day;
 *  the soonest upcoming one starts open, so it is the first thing seen. */
export function Events({ events, notifyHref }: { events: CommunityEvent[]; notifyHref: string }) {
  const first = events.findIndex((e) => e.startsAt && e.timing === "upcoming");
  return (
    <ul className="mt-10 border-t border-ink/12">
      {events.map((e, i) => (
        <Row key={e.id} e={e} i={i} open={i === first} notifyHref={notifyHref} />
      ))}
    </ul>
  );
}
