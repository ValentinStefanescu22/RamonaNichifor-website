"use client";
import { useRef } from "react";
import Image from "next/image";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { Media } from "@/content/types";

/** The book cover at a -2.5° rest; with a mouse it tilts toward the pointer (±7° / ±5°) on a spring. Touch keeps it still. */
export function TiltCover({ cover }: { cover: Media }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  return (
    <div
      ref={ref}
      className="mx-auto w-[min(72vw,340px)] [perspective:1200px] lg:w-[400px]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <m.div style={{ rotateX: rx, rotateY: ry, rotateZ: -2.5 }}>
        <Image
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          sizes="(min-width: 1024px) 400px, min(72vw, 340px)"
          draggable={false}
          className="art shadow-book block h-auto w-full rounded-l-[4px] rounded-r-[10px]"
        />
      </m.div>
    </div>
  );
}
