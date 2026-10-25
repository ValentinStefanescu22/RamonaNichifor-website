import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/page/Reveal";
import { StatusChip } from "@/components/ui/StatusChip";
import { TextLink } from "@/components/ui/links";
import { Brush, OpenBook, Pen, Speech } from "@/components/ui/icons";
import type { CommunityEvent } from "@/content/types";

const look = {
  "atelier-pictura": { Icon: Brush, tint: "#e6dcf5" },
  lansare: { Icon: OpenBook, tint: "#f3c9dc" },
  autografe: { Icon: Pen, tint: "#fbe1da" },
  "atelier-citit": { Icon: Speech, tint: "#c8daf0" },
} as const;

/** „17 mai 2030, 12:30”: Romania's clock whatever the server's */
function when(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ro" ? "ro-RO" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Bucharest",
  }).format(new Date(iso));
}

/** What we do together: four kinds of gathering, each with „Datele, în curând” until it has a date, then date, place and the way in */
export function Events({ events }: { events: CommunityEvent[] }) {
  const t = useTranslations("community");
  const locale = useLocale();
  return (
    <ul className="mt-10 border-t border-ink/12">
      {events.map((e, i) => {
        const { Icon, tint } = look[e.kind];
        return (
          <li key={e.id} className="border-b border-ink/12">
            <Reveal i={i} className="grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-3 py-7 sm:grid-cols-[5.5rem_1fr_auto] sm:items-center sm:gap-x-8">
              <div className="relative grid aspect-square place-items-center">
                <span className="paint-edge absolute inset-0 rounded-full opacity-80" style={{ background: tint }} aria-hidden="true" />
                <Icon size={30} className="relative text-ink" />
              </div>
              <div className="min-w-0">
                <h3 className="display text-[clamp(1.35rem,4.8vw,1.7rem)] leading-tight text-ink">{e.title}</h3>
                {e.audience && <p className="mt-1 text-[1rem] text-ink-soft">{e.audience}</p>}
                <p className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[0.95rem] text-ink-soft">
                  <span className="font-semibold text-violet">{t(`kind.${e.kind}`)}</span>
                  {e.startsAt ? (
                    <>
                      <time dateTime={e.startsAt}>{when(e.startsAt, locale)}</time>
                      {e.place && <span>{e.place}</span>}
                      {e.online && <span>{t("online")}</span>}
                    </>
                  ) : (
                    <StatusChip>{t("datesSoon")}</StatusChip>
                  )}
                </p>
                {e.startsAt && e.signUpNote && <p className="mt-2 max-w-[46ch] text-[0.95rem] text-ink-soft">{e.signUpNote}</p>}
              </div>
              {e.startsAt && e.timing === "upcoming" && (
                <TextLink href={{ pathname: "/contact", query: { subiect: "comunitate" } }} className="col-start-2 justify-self-start sm:col-start-3">
                  {t("join")}
                </TextLink>
              )}
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
