import type { CSSProperties } from "react";
import Image from "next/image";
import type { Media } from "@/content/types";
import { Butterfly } from "@/components/poiana/Butterfly";

/** Her photo in an arch with a lilac wash; the cover butterfly rests on the arch, Buburuza climbs the frame at the other corner. */
export function Portrait({ portrait }: { portrait: Media }) {
  return (
    <div className="relative mx-auto w-[min(76vw,380px)] pt-10">
      <span className="paint-edge absolute -inset-x-4 top-6 -bottom-4 rounded-[999px_999px_2.5rem_2.5rem] bg-lilac/45" aria-hidden="true" />
      {/* a photo, not artwork: framed in the arch, so it may be cropped */}
      <Image
        src={portrait.src}
        alt={portrait.alt || "Ramona Nichifor"}
        width={portrait.width}
        height={portrait.height}
        sizes="(min-width: 1024px) 380px, 76vw"
        priority
        className="arch relative aspect-[4/5] w-full object-cover object-[50%_22%]"
      />
      <div className="absolute top-0 right-[6%] w-[30%] rotate-[14deg]">
        <Butterfly width="100%" tempo={1.7} />
      </div>
      <div className="absolute -bottom-5 -left-2 w-[22%] -rotate-[16deg]">
        {/* eslint-disable-next-line @next/next/no-img-element -- a decorative cut-out, not artwork */}
        <img src="/img/ladybird.webp" alt="" width={457} height={508} loading="lazy" draggable={false} className="ladybird perch-sway block h-auto w-full" style={{ "--dur": "5.6s", "--dl": "0s" } as CSSProperties} />
      </div>
    </div>
  );
}
