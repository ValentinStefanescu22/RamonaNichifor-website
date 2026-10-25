"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import type { Media } from "@/content/types";

/**
 * A work's pictures, one frame each, whole in their own proportions. They swipe with native CSS scroll-snap (`.snap-row`);
 * the dots follow the scroll position and each one is a button that scrolls to its picture. One picture: no dots, nothing to swipe.
 */
export function ArtworkSwipe({ images, title }: { images: Media[]; title: string }) {
  const t = useTranslations("art");
  const reduce = useReducedMotion();
  const row = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState(0);
  const many = images.length > 1;
  const go = (i: number) => row.current?.scrollTo({ left: i * row.current.clientWidth, behavior: reduce ? "auto" : "smooth" });

  return (
    <div className="grid place-items-center bg-mist p-4 sm:p-6 lg:p-10">
      <div className="w-full min-w-0 max-w-[460px]">
        <ul
          ref={row}
          data-swipe
          // a scroll area with a keyboard: arrows move between pictures
          tabIndex={many ? 0 : undefined}
          aria-label={many ? t("images") : undefined}
          onScroll={(e) => setAt(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="snap-row flex overflow-x-auto"
        >
          {images.map((img, i) => (
            <li key={img.src} className="w-full shrink-0 px-1 py-1">
              <div className="mx-auto rounded-[3px] bg-[#fffdf9] p-3 shadow-soft">
                <Image
                  src={img.src}
                  alt={img.alt || title}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1024px) 460px, 90vw"
                  priority={i === 0}
                  draggable={false}
                  className="art block h-auto w-full"
                />
              </div>
            </li>
          ))}
        </ul>
        {many && (
          <div className="mt-3 flex justify-center">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={t("imageN", { n: i + 1, total: images.length })}
                aria-current={i === at ? "true" : undefined}
                className="group grid size-11 place-items-center"
              >
                <span className={`size-2.5 rounded-full transition-colors duration-300 ${i === at ? "bg-ink" : "bg-ink/25"}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
