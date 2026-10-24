import { useTranslations } from "next-intl";
import type { Book, SiteSettings } from "@/content/types";
import { BuySoon } from "@/components/ui/BuySoon";
import { ArrowRight } from "@/components/ui/icons";
import { PillLink } from "@/components/ui/links";
import { TiltCover } from "./TiltCover";

export function FeaturedBook({ book, site }: { book: Book; site: SiteSettings }) {
  const t = useTranslations("ui");
  return (
    <section
      id="carte"
      className="relative scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28"
      style={{ background: "linear-gradient(180deg, var(--color-cream), var(--color-petal) 38%, var(--color-cream))" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <TiltCover cover={book.cover} />
        <div className="min-w-0">
          <h2 className="display text-[clamp(2.3rem,8.5vw,4rem)] font-[380] text-ink">{book.title}</h2>
          <p className="display mt-3 text-[1.3rem] leading-snug italic text-ink-soft">{book.subtitle}</p>
          <p className="mt-3 text-[0.95rem] font-bold text-violet">
            {t("forChildren")} · {book.year} · „{site.series}”
          </p>
          <div className="mt-6 max-w-[58ch] space-y-4 text-[1.05rem] leading-relaxed text-ink-soft">
            {book.blurb.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <PillLink href={{ pathname: "/carti/[slug]", params: { slug: book.slug } }} icon={<ArrowRight size={17} />} className="mt-8">
            {t("aboutBook")}
          </PillLink>
          <BuySoon link={false} className="mt-5" />
          <p className="mt-3 text-[0.92rem] text-ink-soft tabular-nums">ISBN {book.isbn}</p>
        </div>
      </div>
    </section>
  );
}
