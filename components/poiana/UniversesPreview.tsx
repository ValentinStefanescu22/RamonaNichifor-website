"use client";
import type { ReactNode, RefObject } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { SiteSettings, Universe } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/icons";
import { Creature } from "@/components/ui/creatures";
import { Butterfly } from "./Butterfly";

function SectionTitle({ children, lead }: { children: ReactNode; lead?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <h2 className="display text-[clamp(2.4rem,9vw,4.2rem)] font-[380] text-ink">{children}</h2>
      {lead && <div className="mt-4 max-w-[52ch] text-[1.08rem] leading-relaxed text-ink-soft">{lead}</div>}
    </div>
  );
}

const windowSizes = "(min-width: 1024px) 25vw, min(72vw, 300px)";

export function UniversesPreview({
  site,
  universes,
  perchRef,
  landed,
}: {
  site: SiteSettings;
  universes: Universe[];
  perchRef: RefObject<HTMLDivElement | null>;
  landed: boolean;
}) {
  const t = useTranslations();
  return (
    <section id="universuri" className="relative scroll-mt-20 overflow-hidden bg-cream pt-10 pb-24 lg:pt-16">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6">
        <SectionTitle
          lead={
            <>
              <span className="display text-[1.25rem] italic text-violet">„{site.series}”</span>
              <span className="mt-1 block">{site.seriesLead}</span>
            </>
          }
        >
          {t("nav.universes")}
        </SectionTitle>
      </div>

      <ul className="snap-row mt-10 flex gap-4 overflow-x-auto px-[max(1rem,calc((100vw-72rem)/2))] sm:px-[max(1.5rem,calc((100vw-72rem)/2))] pb-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
        {universes.map((u) => {
          const live = u.status === "available";
          // the Fluture window is the butterfly's home: its meadow is where the flight lands
          const meadow = u.homeWindow === "meadow";
          return (
            <li key={u.slug} className="w-[72vw] max-w-[300px] shrink-0 lg:w-auto lg:max-w-none">
              <Link href={{ pathname: "/universuri/[slug]", params: { slug: u.slug } }} className="group relative block">
                <div
                  className="arch relative aspect-[3/4] overflow-hidden shadow-soft"
                  style={{
                    background: meadow
                      ? "linear-gradient(180deg, var(--color-sky) 0%, var(--color-mist) 42%, var(--color-cream) 70%)"
                      : u.homeWindow === "scene"
                        ? `linear-gradient(180deg, var(--color-sky) 0%, ${u.tint[0]} 38%, #fbf1e2 70%)`
                        : u.tint[0],
                  }}
                >
                  {meadow ? (
                    <>
                      <Image
                        src="/img/meadow.webp"
                        width={645}
                        height={505}
                        sizes={windowSizes}
                        alt=""
                        className="absolute inset-x-0 bottom-0 h-[64%] w-full object-cover object-[40%_100%] transition-transform duration-[1.4s] ease-(--ease-bloom) group-hover:scale-[1.04]"
                      />
                      {/* The butterfly comes home to its meadow here; under reduced motion she is simply perched (CSS) */}
                      <div ref={perchRef} className="absolute top-[13%] left-1/2 w-[48%] -translate-x-1/2" aria-hidden="true">
                        <div data-perch="window" className={`${landed ? "opacity-100" : "opacity-0"} motion-reduce:opacity-100`}>
                          <Butterfly width="100%" tempo={1.5} />
                        </div>
                      </div>
                    </>
                  ) : u.homeWindow === "scene" && u.scene ? (
                    // her own cover painting, the way the Fluture window is the meadow from his
                    <Image
                      src={u.scene.src}
                      width={u.scene.width}
                      height={u.scene.height}
                      sizes={windowSizes}
                      alt=""
                      className="absolute inset-x-0 bottom-0 h-[82%] w-full object-cover object-[46%_100%] transition-transform duration-[1.4s] ease-(--ease-bloom) group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="relative grid h-full place-items-center">
                      <span
                        className="paint-edge absolute inset-[12%] rounded-full opacity-80"
                        style={{ background: `radial-gradient(circle at 40% 35%, ${u.tint[0]}, ${u.tint[1]} 70%)` }}
                      />
                      {u.creature && <Creature id={u.creature} size={112} className="relative" style={{ color: u.tint[2] }} />}
                    </div>
                  )}
                  <span
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[0.78rem] font-bold whitespace-nowrap"
                    style={{ background: "rgb(251 247 241 / 0.88)", color: u.tint[2] }}
                  >
                    {t(live ? "ui.bookOut" : "ui.comingSoon")}
                  </span>
                </div>
                <div className="px-1 pt-4">
                  <h3 className="display text-[1.4rem] leading-tight text-ink">{u.name}</h3>
                  <p className="mt-1 text-[0.98rem] italic text-ink-soft">{u.bookTitle}</p>
                  {/* every world has its own page, including the ones still „în curând” */}
                  <span className={`mt-3 inline-flex min-h-11 items-center gap-2 font-bold ${meadow ? "text-magenta" : "text-ink-soft"}`}>
                    {t("ui.discover")}
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
