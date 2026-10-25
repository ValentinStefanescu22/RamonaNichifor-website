import { ViewTransition, type CSSProperties, type ReactNode } from "react";
import type { Universe } from "@/content/types";
import { Butterfly } from "@/components/poiana/Butterfly";
import { Creature } from "@/components/ui/creatures";

/** What an orb needs: `id` is the universe's Romanian slug, the same in both languages (it names the morph). */
export type OrbUniverse = Pick<Universe, "tint" | "status" | "creature"> & { id: string };

/**
 * The watercolour orb (DESIGN.md "Watercolor orb"), shared by the map, the universe hero and „Alte universuri" so the morph
 * lines up. It holds the flapping butterfly (Fluturele), the ladybird cut out of page 9 of her book (Buburuza), or the
 * line-drawn creature of a universe still „în curând”.
 * ponytail: which picture by RO slug, as the mockup did by id; an orb-art field in Payload when a third universe goes live.
 */
export function OrbArt({ u, size, className = "", style }: { u: OrbUniverse; size: string; className?: string; style?: CSSProperties }) {
  const live = u.status === "available";
  const [light, mid, deep] = u.tint;
  return (
    <div data-orb className={`relative grid aspect-square place-items-center rounded-full ${className}`} style={{ width: size, ...style }}>
      <span
        className={`absolute -inset-[18%] rounded-full blur-2xl ${live ? "orb-glow" : "opacity-40"}`}
        style={{ background: `radial-gradient(circle, ${mid} 0%, transparent 68%)` }}
        aria-hidden="true"
      />
      <span
        className="orb-edge absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 36% 30%, #fff8f1 0%, ${light} 30%, ${mid} 88%)`,
          boxShadow: `inset -10px -14px 30px ${deep}33, inset 8px 10px 24px #ffffff80`,
        }}
        aria-hidden="true"
      />
      <span className="relative grid w-[64%] place-items-center" aria-hidden="true">
        {u.id === "fluturele" ? (
          <Butterfly width="100%" tempo={1.1} />
        ) : u.id === "buburuza" ? (
          // eslint-disable-next-line @next/next/no-img-element -- a small decorative cut-out (no © stamp, client rules)
          <img src="/img/ladybird.webp" alt="" draggable={false} className="ladybird block h-auto w-[86%]" style={{ animation: "sway 5.4s ease-in-out infinite" }} />
        ) : u.creature ? (
          <Creature id={u.creature} size="78%" style={{ color: deep }} />
        ) : null}
      </span>
    </div>
  );
}

/** Only the map orb and the universe hero orb wear this: the pair React morphs on a link typed "morph" (Task 0 spike). */
export function MorphOrb({ id, children }: { id: string; children: ReactNode }) {
  return (
    <ViewTransition name={`orb-${id}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
