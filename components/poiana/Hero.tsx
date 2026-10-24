"use client";
import { useRef, type RefObject } from "react";
import Image, { getImageProps } from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import type { SiteSettings } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { Armchair, ArrowDown, Brush, OpenBook } from "@/components/ui/icons";
import { Butterfly } from "./Butterfly";

const MotionImage = m.create(Image);

const delay = (s: number) => ({ ["--d" as string]: `${s}s` });

// Feathers the top of the meadow into the sky, whatever part of the painting object-fit keeps
const meadowMask = {
  maskImage: "linear-gradient(180deg, transparent 0%, #000 26%)",
  WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 26%)",
};

// The narrow meadow on phones, the wide painting from 1024px: one <picture>, so each breakpoint fetches one file
const meadowCommon = { alt: "", sizes: "100vw", fetchPriority: "high", loading: "eager" } as const;
const meadowWide = getImageProps({ ...meadowCommon, src: "/img/meadow-wide.webp", width: 1545, height: 505 }).props;
const meadowNarrow = getImageProps({ ...meadowCommon, src: "/img/meadow.webp", width: 645, height: 505 }).props;

function Meadow({ className }: { className: string }) {
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={meadowWide.srcSet} sizes={meadowWide.sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img {...meadowNarrow} className={className} />
    </picture>
  );
}

const paths = [
  { href: "/carti", label: "books", Icon: OpenBook },
  { href: "/arta", label: "art", Icon: Brush },
  { href: "/consiliere", label: "counselling", Icon: Armchair },
] as const;

export function Hero({ site, startRef }: { site: SiteSettings; startRef: RefObject<HTMLDivElement | null> }) {
  const t = useTranslations();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const washY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const backMeadowY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const meadowY = useTransform(scrollYProgress, [0, 1], ["0%", "-26%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  // No parallax under reduced motion; at rest both render `transform: none`, so hydration matches
  const reduce = useReducedMotion();
  const still = (v: typeof washY) => (reduce ? 0 : v);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[max(640px,calc(100svh-36px))] flex-col overflow-hidden lg:min-h-[max(720px,calc(100svh-36px))]"
      style={{ background: "linear-gradient(180deg, var(--color-sky) 0%, var(--color-mist) 38%, var(--color-cream) 72%)" }}
    >
      <MotionImage
        src="/img/wash.webp"
        width={844}
        height={1500}
        sizes="(min-width: 1024px) 45vw, 135vw"
        preload
        alt=""
        aria-hidden="true"
        className="wash-in pointer-events-none absolute -top-[8%] -right-[18%] -z-10 h-[108%] w-auto max-w-none mix-blend-multiply sm:-right-[6%]"
        style={{
          y: still(washY),
          maskImage: "linear-gradient(90deg, transparent 0%, #000 42%), linear-gradient(180deg, #000 62%, transparent 92%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-[75rem] flex-1 grid-cols-1 content-start px-4 pt-[9vh] sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:content-center lg:pt-16 lg:pb-[31vh]">
        <m.div style={{ y: still(textY) }} className="relative z-10">
          <svg
            viewBox="0 0 400 260"
            className="bloom-in pointer-events-none absolute -top-10 -left-16 -z-10 w-[125%] max-w-[640px]"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="bloom-fill" cx="45%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#f3d3e3" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#dccbf0" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#dccbf0" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="190" cy="130" rx="170" ry="95" fill="url(#bloom-fill)" filter="url(#paint-bloom)" />
          </svg>

          <h1 className="display text-[clamp(3.7rem,17vw,8.6rem)] font-[380] text-ink">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="rise block" style={delay(0.25)}>
                Ramona
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em] pl-[0.6em] sm:pl-[0.9em]">
              <span className="rise display-wonk block italic text-violet" style={delay(0.37)}>
                Nichifor
              </span>
            </span>
          </h1>

          <p
            className="fade-up display mt-5 max-w-[22ch] text-[clamp(1.35rem,4.8vw,1.9rem)] leading-[1.2] italic text-ink-soft"
            style={delay(0.62)}
          >
            {site.souls}
          </p>
          <p className="fade-up mt-3 max-w-[34ch] text-[0.98rem] leading-snug text-ink-soft" style={delay(0.72)}>
            {site.roles}
          </p>

          <div className="fade-up mt-7 flex flex-wrap items-center gap-x-5 gap-y-3" style={delay(0.84)}>
            <a
              href="#universuri"
              className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-6 text-[1.02rem] font-medium text-cream shadow-soft transition-transform duration-150 active:scale-[0.97]"
            >
              {t("ui.enterStory")}
              <span className="grid size-9 place-items-center rounded-full bg-cream/15 transition-transform duration-500 ease-(--ease-bloom) group-hover:translate-y-0.5">
                <ArrowDown size={18} />
              </span>
            </a>
          </div>
        </m.div>

        {/* Where the butterfly rests before it takes off; sized per breakpoint. Under reduced motion
            (CSS, so the server HTML is already right) she sits here with wings open instead of flying */}
        <div className="pointer-events-none absolute top-[max(64px,8.5vh)] right-[4%] lg:relative lg:top-auto lg:right-auto lg:flex lg:items-center lg:justify-center">
          <div ref={startRef} className="w-[27vw] max-w-[130px] lg:mt-[4vh] lg:w-[300px] lg:max-w-none">
            <div data-perch="hero" className="hidden motion-reduce:block">
              <Butterfly width="100%" flap={false} />
            </div>
            <div className="aspect-[447/406] motion-reduce:hidden" />
          </div>
        </div>
      </div>

      {/* Meadow from the cover: a hazy back row, the sharp foreground, and the three paths at its edge */}
      <div className="relative h-[clamp(190px,33vh,380px)] lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-[clamp(200px,29vh,340px)]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={meadowMask}>
          <m.div className="absolute inset-x-0 bottom-[20%] h-[80%] opacity-50 blur-[1.5px]" style={{ y: still(backMeadowY) }}>
            <Meadow className="h-full w-full scale-x-[-1] object-cover object-[30%_100%]" />
          </m.div>
          <m.div className="absolute inset-x-0 -bottom-[4%] h-full" style={{ y: still(meadowY) }}>
            <div className="meadow-in h-full">
              <Meadow className="h-full w-full object-cover object-[62%_100%]" />
            </div>
          </m.div>
        </div>
        <nav aria-label={site.rolesShort} className="fade-up relative z-10 flex justify-center gap-2 px-4 pt-[16%] lg:pt-[8%]" style={delay(1)}>
          {paths.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-cream/85 px-4 text-[0.98rem] font-medium text-ink shadow-soft ring-1 ring-ink/5 backdrop-blur-sm transition-transform duration-150 active:scale-[0.96] lg:min-h-12 lg:px-5 lg:text-[1.05rem]"
            >
              <Icon size={17} className="text-violet" />
              {t(`nav.${label}`)}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
