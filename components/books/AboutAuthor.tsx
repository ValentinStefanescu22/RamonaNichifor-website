import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { BooksPage, Media } from "@/content/types";
import { TextLink } from "@/components/ui/links";

/** „Despre autor”, the last word before the footer: the books first, then the person behind them. Her text, as she wrote it. */
export async function AboutAuthor({ author, portrait }: { author: BooksPage["author"]; portrait: Media }) {
  const t = await getTranslations("ui");
  const [first = "", ...rest] = author.paragraphs;
  const name = "Ramona Nichifor";
  return (
    <section aria-labelledby="despre-autor" className="relative overflow-hidden bg-cream px-4 pb-16 sm:px-6 lg:pb-20">
      <div className="mx-auto grid max-w-6xl items-start gap-10 pt-6 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20 lg:pt-10">
        <div className="relative mx-auto w-[min(58vw,260px)] pt-4 lg:sticky lg:top-28 lg:mx-0 lg:w-full lg:max-w-[300px]">
          <span className="paint-edge absolute -inset-x-3 top-1 -bottom-3 rounded-[999px_999px_2.5rem_2.5rem] bg-petal" aria-hidden="true" />
          {/* a photo, not artwork: framed in the arch, so it may be cropped */}
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            sizes="(min-width: 1024px) 300px, 58vw"
            className="arch relative aspect-[4/5] w-full object-cover object-[50%_22%]"
          />
        </div>
        <div className="max-w-[58ch]">
          <h2 id="despre-autor" className="display text-[clamp(2.2rem,8.5vw,3.6rem)] font-[380] text-ink">
            {author.title}
          </h2>
          <div className="mt-6 space-y-5 text-[1.08rem] leading-[1.65] text-ink">
            {first && (
              <p className="text-[1.2rem] leading-[1.65] text-ink">
                {/* her name opens the text in her own weight, as on the printed page */}
                {first.startsWith(name) ? (
                  <>
                    <strong className="font-bold">{name}</strong>
                    {first.slice(name.length)}
                  </>
                ) : (
                  first
                )}
              </p>
            )}
            {rest.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {author.statement && <p className="display !mt-9 text-[clamp(1.45rem,4.6vw,1.9rem)] leading-[1.25] font-[360] text-violet italic text-balance">{author.statement}</p>}
          </div>
          <TextLink href="/despre" className="mt-6">
            {t("myStory")}
          </TextLink>
        </div>
      </div>
    </section>
  );
}
