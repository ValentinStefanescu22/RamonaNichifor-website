"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { SiteSettings, Universe } from "@/content/types";
import { Hero } from "./Hero";
import { Paths } from "./Paths";
import { UniversesPreview } from "./UniversesPreview";

// The flight is pure decoration: it loads after first paint and renders nothing under reduced motion
const Flight = dynamic(() => import("./Flight"), { ssr: false });

/** Hero, paths and universes share one zone: the butterfly flies through it and lands in the Fluture window. */
export function HomeFlightZone({ site, universes }: { site: SiteSettings; universes: Universe[] }) {
  const [landed, setLanded] = useState(false);
  const zoneRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLDivElement>(null);
  const perchRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={zoneRef} className="relative overflow-x-clip">
      <Hero site={site} startRef={startRef} />
      <Paths site={site} />
      <UniversesPreview site={site} universes={universes} perchRef={perchRef} landed={landed} />
      <Flight zoneRef={zoneRef} startRef={startRef} endRef={perchRef} onLanded={setLanded} />
    </div>
  );
}
