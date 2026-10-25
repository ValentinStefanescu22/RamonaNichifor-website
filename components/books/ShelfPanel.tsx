import { getTranslations } from "next-intl/server";
import type { Book, Universe } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { Painted } from "@/components/page/Painted";
import { ArrowRight } from "@/components/ui/icons";
import { StatusChip } from "@/components/ui/StatusChip";
import type { AgeId } from "./AgeTabs";

const FALLBACK_TINT: Universe["tint"] = ["#F8DCEB", "#E58FBF", "#9B3F7A"];

/** One book on the shelf: it stands on a soft contact shadow, lifts under the pointer, and opens its page. */
async function ShelfItem({ b, tint }: { b: Book; tint: Universe["tint"] }) {
  const [t, ui] = await Promise.all([getTranslations("books"), getTranslations("ui")]);
  const out = b.status === "published";
  return (
    <li>
      <Link href={{ pathname: "/carti/[slug]", params: { slug: b.slug } }} className="group block">
        <div className="relative px-[6%]">
          <div className="transition-transform duration-500 ease-(--ease-bloom) group-hover:-translate-y-2 group-hover:-rotate-[1.5deg]" aria-hidden="true">
            <Painted variant="book" title={b.title} cover={b.cover} tint={tint} sizes="(min-width: 1024px) 22vw, 44vw" />
          </div>
          <span className="mx-auto mt-1 block h-3 w-[96%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(52_34_74/0.22),transparent)]" aria-hidden="true" />
        </div>
        <div className="mt-3 px-1">
          <h3 className="display text-[1.25rem] leading-tight text-ink">{b.title}</h3>
          {b.subtitle && <p className="mt-1 text-[0.95rem] leading-snug text-ink-soft">{b.subtitle}</p>}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {/* a book that is out shows only its year */}
            {!out && <StatusChip>{t(`status.${b.status}`)}</StatusChip>}
            {b.year > 0 && <span className="text-[0.88rem] text-ink-soft tabular-nums">{b.year}</span>}
          </div>
          <span className={`mt-1 inline-flex min-h-11 items-center gap-1.5 font-semibold underline decoration-lilac decoration-2 underline-offset-[6px] ${out ? "text-ink" : "text-ink-soft"}`}>
            {ui("aboutBook")}
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </li>
  );
}

/** The inside of one age group: the series name over its books, or the designed „în lucru” line when there are none yet. */
export async function ShelfPanel({ age, books, series, tints }: { age: AgeId; books: Book[]; series: string; tints: Record<string, Universe["tint"]> }) {
  const [t, ui] = await Promise.all([getTranslations("books"), getTranslations("ui")]);
  return (
    <>
      {age === "copii" ? (
        <p className="display text-[1.35rem] text-violet italic">„{series}”</p>
      ) : (
        <p className="flex flex-wrap items-center gap-3 text-[1.05rem] text-ink-soft">
          <StatusChip>{ui("inProgress")}</StatusChip>
          {t(`ageLine.${age}`)}
        </p>
      )}
      {books.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {books.map((b) => (
            <ShelfItem key={b.slug} b={b} tint={tints[b.universeSlug] ?? FALLBACK_TINT} />
          ))}
        </ul>
      )}
    </>
  );
}
