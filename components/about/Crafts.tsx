import { Link } from "@/i18n/navigation";
import type { AppHref } from "@/components/ui/links";
import { ArrowRight, ArrowUpRight, Facebook, Instagram } from "@/components/ui/icons";
import type { About } from "@/content/types";
import { SectionTitle } from "@/components/page/SectionTitle";

/** One craft as a wide brush stroke of its colour, painted in as it scrolls in (CSS `.craft-stroke`; drawn already without motion) */
function Craft({ name, line, href, tint, index }: About["crafts"]["items"][number] & { index: number }) {
  return (
    <li className={`w-full max-w-xl ${index % 2 === 1 ? "lg:ml-auto" : ""} ${index === 2 ? "lg:ml-[12%]" : ""}`}>
      <Link href={href as AppHref} className="group relative block py-6">
        <svg viewBox="0 0 400 90" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-[-4%] top-1/2 h-[84px] w-[108%] -translate-y-[62%] overflow-visible" aria-hidden="true">
          <path
            className="craft-stroke"
            d="M14 52 C 90 22, 170 70, 250 40 S 360 30, 388 46"
            fill="none"
            stroke={tint}
            strokeWidth="44"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1 1.5"
            opacity="0.9"
            filter="url(#paint-edge)"
          />
        </svg>
        <span className="relative flex items-baseline justify-between gap-4">
          <span className="display text-[clamp(2.4rem,10vw,3.6rem)] font-[380] text-ink">{name}</span>
          <ArrowRight size={24} className="shrink-0 text-ink transition-transform duration-300 group-hover:translate-x-1" />
        </span>
        <span className="relative mt-2 block max-w-[36ch] text-[1.05rem] text-ink-soft">{line}</span>
      </Link>
    </li>
  );
}

const profile = (url: string) => {
  let host = url; // a typo in the CMS (no https://) must not take the page down: show the text as is
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {}
  if (host.endsWith("instagram.com")) return { label: "Instagram", icon: <Instagram size={17} /> };
  if (host.endsWith("facebook.com")) return { label: "Facebook", icon: <Facebook size={17} /> };
  return { label: host, icon: null };
};

/** „Trei meșteșuguri, o singură mână” and, under it, all her profiles (the same links as the Person's sameAs) */
export function Crafts({ crafts, findMe, sameAs }: { crafts: About["crafts"]; findMe: string; sameAs: string[] }) {
  return (
    <section className="relative overflow-hidden bg-cream px-4 pt-8 pb-24 sm:px-6 lg:pb-32">
      <div className="mx-auto max-w-6xl">
        <SectionTitle id="crafts-title">{crafts.title}</SectionTitle>
        <ul aria-labelledby="crafts-title" className="mt-10 flex flex-col gap-4 lg:mt-14 lg:gap-2">
          {crafts.items.map((c, i) => (
            <Craft key={c.name} index={i} {...c} />
          ))}
        </ul>
        {sameAs.length > 0 && (
          <div className="mt-16 lg:mt-24">
            <h2 id="find-me" className="display text-[clamp(1.5rem,5vw,2rem)] font-[380] text-ink">
              {findMe}
            </h2>
            <ul aria-labelledby="find-me" className="mt-5 flex flex-wrap gap-3">
              {sameAs.map((url) => {
                const { label, icon } = profile(url);
                return (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-white/60 px-5 font-semibold text-ink ring-1 ring-ink/10 transition-transform duration-300 hover:-translate-y-0.5">
                      {icon}
                      {label}
                      <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
