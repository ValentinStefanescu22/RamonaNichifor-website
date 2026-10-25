import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getBooks, getBooksPage, getSiteSettings, getUniverses } from "@/content";
import type { Book } from "@/content/types";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { Painted } from "@/components/page/Painted";
import { BuySoon } from "@/components/ui/BuySoon";
import { AboutAuthor } from "@/components/books/AboutAuthor";
import type { AgeId } from "@/components/books/AgeTabs";
import { Shelf } from "@/components/books/Shelf";
import { ShelfPanel } from "@/components/books/ShelfPanel";

type Props = { params: Promise<{ locale: Locale }> };

const AGES: AgeId[] = ["copii", "adolescenti", "adulti"];
const FALLBACK_TINT: [string, string, string] = ["#F8DCEB", "#E58FBF", "#9B3F7A"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, site, books] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getSiteSettings(locale), getBooks(locale)]);
  return pageMetadata({ locale, path: "/carti", title: t("books"), description: `${site.souls}. ${site.series}: ${books.map((b) => b.title).join(", ")}.` });
}

/** The covers fanned on the opener: the newest in front, the others behind it on either side. */
function CoverStack({ books, tint }: { books: Book[]; tint: (b: Book) => [string, string, string] }) {
  const poses = {
    1: ["left-1/2 top-0 w-[56%] -translate-x-1/2 -rotate-[1.5deg]"],
    2: ["right-[2%] top-[4%] w-[52%] rotate-[8deg]", "left-[6%] top-0 w-[52%] -rotate-[4deg]"],
    3: ["left-[2%] top-[10%] w-[52%] -rotate-[9deg]", "right-0 top-[4%] w-[52%] rotate-[8deg]", "left-1/2 top-0 w-[52%] -translate-x-1/2 -rotate-[1.5deg]"],
  } as const;
  const fan = books.slice(0, 3).reverse();
  const pose = poses[fan.length as 1 | 2 | 3];
  return (
    <div className="relative mx-auto aspect-[1.05] w-[min(84vw,440px)]" aria-hidden="true">
      {fan.map((b, i) => (
        <div key={b.slug} className={`absolute ${pose[i]}`}>
          <Painted variant="book" title={b.title} cover={b.cover} tint={tint(b)} sizes="(min-width: 1024px) 230px, 44vw" />
        </div>
      ))}
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, site, books, page, universes] = await Promise.all([getTranslations(), getSiteSettings(locale), getBooks(locale), getBooksPage(locale), getUniverses(locale)]);
  const tints = Object.fromEntries(universes.map((u) => [u.slug, u.tint]));
  const tintOf = (b: Book) => tints[b.universeSlug] ?? FALLBACK_TINT;
  const ofAge = (id: AgeId) => books.filter((b) => b.ageGroup === id);

  return (
    <main>
      <JsonLd data={breadcrumbLd(locale, [{ name: t("nav.books"), path: "/carti" }])} />
      <PageHero tone="petal" title={t("nav.books")} tagline={site.souls} lead={<p>{site.whisper}</p>} aside={books.length ? <CoverStack books={books} tint={tintOf} /> : undefined} />

      <section className="bg-cream px-4 pt-6 pb-20 sm:px-6 lg:pb-28">
        <div className="mx-auto max-w-6xl">
          <Shelf
            label={t("nav.books")}
            ages={AGES.map((id) => ({ id, label: t(`books.ages.${id}`), count: ofAge(id).length }))}
            panels={Object.fromEntries(AGES.map((id) => [id, <ShelfPanel key={id} age={id} books={ofAge(id)} series={site.series} tints={tints} />])) as Record<AgeId, React.ReactNode>}
          />
        </div>
      </section>

      <section className="bg-cream px-4 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 border-y border-ink/10 py-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
          <h2 className="display text-[1.8rem] text-ink">{t("books.where")}</h2>
          <div className="space-y-4">
            <BuySoon />
            {page.author.formats.length > 0 && (
              <dl className="grid gap-x-8 gap-y-3 text-[1rem] sm:grid-cols-[auto_1fr]">
                {page.author.formats.map((f) => (
                  <div key={f.label} className="contents">
                    <dt className="font-bold text-ink">{f.label}</dt>
                    {/* the e-book is just „în curând”; the audiobook has her own sentence */}
                    <dd className="max-w-[52ch] text-ink-soft">{f.line || t(f.status === "soon" ? "ui.comingSoon" : "books.planned")}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </section>
      <AboutAuthor author={page.author} portrait={site.portrait} />
    </main>
  );
}
