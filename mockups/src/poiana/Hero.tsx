import { useRef, type RefObject } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { img } from "../shared/assets";
import { Butterfly } from "../shared/Butterfly";
import { nav, site, ui } from "../shared/content";
import { Armchair, ArrowDown, Brush, OpenBook } from "../shared/icons";
import { useLang } from "../shared/lang";

export function PaintDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <filter id="paint-edge" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="paint-bloom" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="60" xChannelSelector="R" yChannelSelector="B" result="warp" />
        <feGaussianBlur in="warp" stdDeviation="6" />
      </filter>
    </svg>
  );
}

const delay = (s: number) => ({ ["--d" as string]: `${s}s` });

// Feathers the top of the meadow into the sky, whatever part of the painting object-fit keeps
const meadowMask = {
  maskImage: "linear-gradient(180deg, transparent 0%, #000 26%)",
  WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 26%)",
};

const paths = [
  { href: "#carte", label: nav.books, Icon: OpenBook },
  { href: "#arta", label: nav.art, Icon: Brush },
  { href: "#consiliere", label: nav.counselling, Icon: Armchair },
];

export function Hero({ startRef }: { startRef: RefObject<HTMLDivElement | null> }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const washY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const backMeadowY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const meadowY = useTransform(scrollYProgress, [0, 1], ["0%", "-26%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[max(640px,calc(100svh-36px))] flex-col overflow-hidden lg:min-h-[max(720px,calc(100svh-36px))]"
      style={{ background: "linear-gradient(180deg, var(--color-sky) 0%, var(--color-mist) 38%, var(--color-cream) 72%)" }}
    >
      <motion.img
        src={img("wash.webp")}
        alt=""
        aria-hidden="true"
        className="wash-in pointer-events-none absolute -top-[8%] -right-[18%] -z-10 h-[108%] w-auto max-w-none mix-blend-multiply sm:-right-[6%]"
        style={{
          y: washY,
          maskImage: "linear-gradient(90deg, transparent 0%, #000 42%), linear-gradient(180deg, #000 62%, transparent 92%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-start px-4 pt-[9vh] sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:content-center lg:pt-16 lg:pb-[31vh]">
        <motion.div style={{ y: textY }} className="relative z-10">
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
            {t(site.souls)}
          </p>
          <p
            className="fade-up mt-3 max-w-[34ch] text-[0.98rem] leading-snug text-ink-soft"
            style={delay(0.72)}
          >
            {t(site.roles)}
          </p>

          <div
            className="fade-up mt-7 flex flex-wrap items-center gap-x-5 gap-y-3"
            style={delay(0.84)}
          >
            <a
              href="#universuri"
              className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-6 text-[1.02rem] font-medium text-cream shadow-soft transition-transform duration-150 active:scale-[0.97]"
            >
              {t(ui.enterStory)}
              <span className="grid size-9 place-items-center rounded-full bg-cream/15 transition-transform duration-500 ease-(--ease-bloom) group-hover:translate-y-0.5">
                <ArrowDown size={18} />
              </span>
            </a>
          </div>
        </motion.div>

        {/* Where the butterfly rests before it takes off; sized per breakpoint */}
        <div className="pointer-events-none absolute top-[max(64px,8.5vh)] right-[4%] lg:relative lg:top-auto lg:right-auto lg:flex lg:items-center lg:justify-center">
          <div ref={startRef} className="w-[27vw] max-w-[130px] lg:mt-[4vh] lg:w-[300px] lg:max-w-none">
            {reduce ? <Butterfly width="100%" flap={false} /> : <div className="aspect-[447/406]" />}
          </div>
        </div>
      </div>

      {/* Meadow from the cover: a hazy back row, the sharp foreground, and the three paths at its edge */}
      <div className="relative h-[clamp(190px,33vh,380px)] lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-[clamp(200px,29vh,340px)]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={meadowMask}>
          <motion.div className="absolute inset-x-0 bottom-[20%] h-[80%] opacity-50 blur-[1.5px]" style={{ y: backMeadowY }}>
            <picture>
              <source media="(min-width: 1024px)" srcSet={img("meadow-wide.webp")} />
              <img src={img("meadow.webp")} alt="" className="h-full w-full scale-x-[-1] object-cover object-[30%_100%]" />
            </picture>
          </motion.div>
          <motion.div className="absolute inset-x-0 -bottom-[4%] h-full" style={{ y: meadowY }}>
            <div className="meadow-in h-full">
              <picture>
                <source media="(min-width: 1024px)" srcSet={img("meadow-wide.webp")} />
                <img src={img("meadow.webp")} alt="" className="h-full w-full object-cover object-[62%_100%]" />
              </picture>
            </div>
          </motion.div>
        </div>
        <nav aria-label={t(site.rolesShort)} className="fade-up relative z-10 flex justify-center gap-2 px-4 pt-[16%] lg:pt-[8%]" style={delay(1)}>
          {paths.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-cream/85 px-4 text-[0.98rem] font-medium text-ink shadow-soft ring-1 ring-ink/5 backdrop-blur-sm transition-transform duration-150 active:scale-[0.96] lg:min-h-12 lg:px-5 lg:text-[1.05rem]"
            >
              <Icon size={17} className="text-violet" />
              {t(label)}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
