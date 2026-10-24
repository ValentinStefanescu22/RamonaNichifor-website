"use client";
import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";

// Components use `m.*`, not `motion.*`, so the animation engine is a separate chunk fetched after
// hydration instead of part of the first-paint JavaScript. `strict` catches a stray `motion.*`.
const features = () => import("./motion-features").then((mod) => mod.default);

export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={features} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
