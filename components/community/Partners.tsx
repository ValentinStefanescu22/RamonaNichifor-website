import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Instagram } from "@/components/ui/icons";
import type { Partner } from "@/content/types";

/** Partners: the logo when we have it, a painted initial until then; a card with a link opens the partner's page in a new tab */
export function Partners({ partners }: { partners: Partner[] }) {
  const t = useTranslations("community");
  return (
    <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {partners.map((p) => {
        const card = (
          <>
            {p.logo ? (
              <Image src={p.logo.src} alt="" width={80} height={80} className="size-20 shrink-0 rounded-full object-cover" />
            ) : (
              <span
                className="display display-wonk grid size-20 shrink-0 place-items-center rounded-full text-[2.4rem] text-violet italic"
                style={{ background: "radial-gradient(circle at 38% 32%, #fffaf3, #e6dcf5 62%, #f3c9dc)" }}
                aria-hidden="true"
              >
                {p.name.charAt(0)}
              </span>
            )}
            <span className="min-w-0">
              <span className="display block text-[1.45rem] leading-tight text-ink">{p.name}</span>
              <span className="mt-1 block text-[0.98rem] leading-snug text-ink-soft">{p.line || t("partnerSoon")}</span>
              {p.handle && (
                <span className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink">
                  <Instagram size={17} />
                  {p.handle}
                  {p.url && <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                </span>
              )}
            </span>
          </>
        );
        const cls = "group flex h-full items-center gap-5 rounded-[1.75rem] bg-white/60 p-5 ring-1 ring-ink/5";
        return (
          <li key={p.id}>
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className={`${cls} transition-transform duration-500 ease-(--ease-bloom) hover:-translate-y-1`}>
                {card}
              </a>
            ) : (
              <div className={cls}>{card}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
