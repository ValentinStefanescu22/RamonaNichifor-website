"use client";
import { useState } from "react";
import Image from "next/image";
import type { Media } from "@/content/types";

/**
 * The book page's cover (mockups/src/pages/carte/App.tsx OpeningCover): hinged at the spine, it opens a little on hover or tap
 * and shows the first page waiting under it. The picture is always whole, in its own proportions.
 */
export function BookCover({ cover, title }: { cover: Media; title: string }) {
  const [open, setOpen] = useState(false);
  const hinge = `relative origin-left transition-transform duration-700 ease-(--ease-bloom) group-hover:[transform:rotateY(-24deg)] ${
    open ? "[transform:rotateY(-24deg)]" : "[transform:rotateY(0deg)_rotateZ(-1.5deg)]"
  }`;
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-pressed={open}
      aria-label={title}
      className="group relative mx-auto block w-[min(70vw,360px)] [perspective:1400px] lg:w-[400px]"
    >
      {/* the first page waiting under the cover */}
      <span className="absolute inset-0 translate-x-[3%] rounded-r-[8px] bg-paper-mat shadow-soft" aria-hidden="true">
        <span className="absolute inset-x-[16%] top-[22%] flex flex-col gap-2.5 opacity-40">
          {[92, 80, 88, 60].map((w, i) => (
            <span key={i} className="h-[3px] rounded-full bg-ink-soft" style={{ width: `${w}%` }} />
          ))}
        </span>
      </span>
      <Image
        src={cover.src}
        alt=""
        width={cover.width}
        height={cover.height}
        sizes="(min-width: 1024px) 400px, 70vw"
        priority
        draggable={false}
        className={`art shadow-book block h-auto w-full rounded-r-[10px] rounded-l-[4px] ${hinge}`}
      />
    </button>
  );
}
