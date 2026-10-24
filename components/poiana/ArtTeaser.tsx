import Image from "next/image";
import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import { getSiteSettings } from "@/content";
import type { Artwork } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { TextLink } from "@/components/ui/links";
import { SectionTitle } from "./SectionTitle";

function GalleryLink() {
  const t = useTranslations("ui");
  return (
    <>
      <TextLink href="/arta">{t("seeGallery")}</TextLink>
      <p className="text-[0.92rem] italic text-ink-soft">{t("exampleNote")}</p>
    </>
  );
}

export async function ArtTeaser({ artworks }: { artworks: Artwork[] }) {
  // title and lead live in the site settings; the page passes only the pieces
  const { artTeaser } = await getSiteSettings((await getLocale()) as Locale);
  return (
    <section id="arta" className="relative scroll-mt-20 overflow-hidden bg-mist px-4 py-20 sm:px-6 lg:py-28">
      {/* two whole covers beside the words (client, 2026-10-13): the text column leads, the paintings answer it */}
      <div className="mx-auto grid max-w-[75rem] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <SectionTitle lead={artTeaser.lead}>{artTeaser.title}</SectionTitle>
          <div className="mt-6 hidden flex-col items-start gap-3 lg:flex">
            <GalleryLink />
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:gap-8 lg:gap-10">
          {artworks.map((a, i) => {
            const img = a.images[0];
            return (
              <li key={a.slug} className={i === 1 ? "mt-10 sm:mt-16" : ""}>
                <figure>
                  <div className="rounded-[4px] bg-[#fffdf9] p-2 shadow-soft sm:p-3">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes="(min-width: 1024px) 320px, 45vw"
                      draggable={false}
                      className="art block h-auto w-full"
                    />
                  </div>
                  <figcaption className="px-0.5 pt-3 sm:pt-4">
                    <span className="display block text-[1.05rem] leading-tight text-ink sm:text-[1.25rem]">{a.title}</span>
                    <span className="text-[0.88rem] text-ink-soft sm:text-[0.95rem]">{a.technique}</span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col items-start gap-3 lg:hidden">
          <GalleryLink />
        </div>
      </div>
    </section>
  );
}
