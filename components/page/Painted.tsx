import Image from "next/image";
import { useTranslations } from "next-intl";
import { Creature } from "@/components/ui/creatures";
import type { CreatureId, Media, ProductKind } from "@/content/types";
import { PaperPlaceholder, SoonLabel } from "./PaperPlaceholder";

// Port of mockups/src/site/Painted.tsx: the stand-ins for Ramona's covers and product photos, in flat paper and hairlines,
// deliberately plain so nobody mistakes them for her work. A real image always wins; these appear only while there is none.

type Tint = [string, string, string]; // [light, mid, deep] of a universe
const PAPER = "#fffdf9";
const COVER_RATIO = 766 / 1120;

/** A very pale paper tinted with a universe or wash colour */
const paperOf = (color: string, amount = 40) => `color-mix(in oklab, ${color} ${amount}%, ${PAPER})`;

/** A book cover: the real image, uncropped, or a paper placeholder with the title (and the universe's character). */
function BookCover({
  title,
  cover,
  tint,
  character,
  sizes = "(min-width: 1024px) 400px, 72vw",
  className = "",
}: {
  title: string;
  cover?: Media | null;
  tint: Tint;
  character?: CreatureId;
  sizes?: string;
  className?: string;
}) {
  const t = useTranslations("ui");
  const shape = `rounded-r-[10px] rounded-l-[4px] shadow-book ${className}`;
  if (cover) {
    return (
      <Image src={cover.src} alt={cover.alt || title} width={cover.width} height={cover.height} sizes={sizes} draggable={false} className={`art ${shape} block h-auto w-full`} />
    );
  }
  const [light, , deep] = tint;
  return (
    <div role="img" aria-label={title} className={`${shape} w-full overflow-hidden`}>
      <PaperPlaceholder ratio={COVER_RATIO} tint={paperOf(light)} className="w-full">
        <div className="flex h-full w-full flex-col items-center justify-between">
          <span className="display text-[9.5cqw] leading-[1.05]" style={{ color: deep }}>
            {title}
          </span>
          {character && <Creature id={character} size="34%" className="opacity-70" style={{ color: deep }} />}
          <SoonLabel>{t("coverSoon")}</SoonLabel>
        </div>
      </PaperPlaceholder>
    </div>
  );
}

/** The frame glyph's sun and mountain, drawn inside a product silhouette at (x, y) */
function Motif({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(-12 -13)`} stroke={color} strokeOpacity="0.4">
      <circle cx="9" cy="9.5" r="1.6" />
      <path d="M4 17.5 9.5 12.5 13 15.5 15.5 13.5 20 17.5" />
    </g>
  );
}

// Real photographs fan out like a hand: playing cards (63×88) and bookmarks (345×1036) keep their own proportions, so nothing is cropped
const fans = {
  "carti-de-joc": { box: "h-[66%] aspect-[63/88]", round: "rounded-[7px]", deg: 13 },
  "semn-de-carte": { box: "h-[72%] aspect-[345/1036]", round: "rounded-[5px]", deg: 10 },
} as const;

/**
 * Product visual. With `images` (the caller picks one to three) it shows the real thing: cards and bookmarks fanned like a hand,
 * any other product's first photo whole. Without them, a PLACEHOLDER silhouette in hairlines on paper (a bookmark, fanned cards,
 * a puzzle, a little board game) in the universe's tint, marked „În curând”.
 */
function ProductArt({ kind, tint, images, className = "" }: { kind: ProductKind; tint: Tint; images?: Media[]; className?: string }) {
  const t = useTranslations("ui");
  if (images?.length) {
    const fan = kind in fans ? fans[kind as keyof typeof fans] : null;
    return (
      <div className={`relative grid aspect-[4/5] place-items-center ${className}`} aria-hidden="true">
        {fan ? (
          <div className={`relative ${fan.box}`}>
            {images.slice(0, 3).map((img, i, all) => {
              const mid = i - (all.length - 1) / 2; // −1 · 0 · 1 for three, ±½ for two
              return (
                <Image
                  key={img.src}
                  src={img.src}
                  alt=""
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  draggable={false}
                  className={`art absolute inset-0 h-full w-full origin-bottom object-cover shadow-soft ${fan.round}`}
                  style={{ transform: `rotate(${mid * fan.deg}deg) translateY(${mid === 0 && all.length > 1 ? -4 : 0}%)`, zIndex: mid === 0 ? 2 : 1 }}
                />
              );
            })}
          </div>
        ) : (
          <Image src={images[0].src} alt="" width={images[0].width} height={images[0].height} sizes="(min-width: 1024px) 30vw, 80vw" draggable={false} className="art max-h-full w-auto max-w-full object-contain shadow-soft" />
        )}
      </div>
    );
  }

  const [light, mid, deep] = tint;
  const wash = paperOf(light, 45);
  const line = { stroke: deep, strokeOpacity: 0.35 };
  const hair = { stroke: deep, strokeOpacity: 0.18 };
  return (
    <div data-placeholder className={`relative aspect-[4/5] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 125" className="absolute inset-0 h-full w-full [&_*]:[vector-effect:non-scaling-stroke]" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        {kind === "semn-de-carte" && (
          // a bookmark with a punched hole and its thread
          <g transform="rotate(-4 50 64)">
            <path d="M50 36 C 45 28, 56 23, 52 16" stroke={mid} strokeWidth="1.5" />
            <circle cx="52" cy="16" r="1.6" fill={mid} stroke="none" />
            <rect x="37" y="28" width="26" height="74" rx="2.5" fill={wash} {...line} />
            <rect x="40" y="31" width="20" height="68" rx="1" {...hair} />
            <circle cx="50" cy="36" r="1.8" fill={PAPER} {...line} />
            <Motif x={50} y={70} s={0.8} color={deep} />
          </g>
        )}
        {kind === "carti-de-joc" &&
          // three card outlines, fanned like a hand
          [-13, 13, 0].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 50 92) translate(0 ${deg ? 0 : -3})`}>
              <rect x="32" y="40" width="36" height="52" rx="3" fill={PAPER} {...line} />
              <rect x="35" y="43" width="30" height="46" rx="1.5" fill={deg ? undefined : wash} {...hair} />
              {!deg && <Motif x={50} y={66} s={0.8} color={deep} />}
            </g>
          ))}
        {kind === "puzzle" && (
          // a square cut into four pieces, one lifted out
          <>
            <g transform="rotate(-2 50 64)">
              <rect x="20" y="34" width="60" height="60" rx="2" fill={wash} {...line} />
              <path transform="translate(20 34) scale(0.6)" d="M50 0 V20 C43 20 43 32 50 32 V68 C57 68 57 80 50 80 V100 M0 50 H20 C20 57 32 57 32 50 H68 C68 43 80 43 80 50 H100" {...line} />
              <Motif x={35} y={79} s={0.7} color={deep} />
            </g>
            <path transform="translate(64 16) rotate(14 9 9) scale(0.32)" d="M6 6 H24 C24 0 36 0 36 6 H54 V24 C60 24 60 36 54 36 V54 H6 Z" fill={paperOf(mid, 45)} {...line} />
          </>
        )}
        {kind === "joc-de-familie" && (
          // a little board: a winding path of stops, and a die
          <>
            <rect x="14" y="22" width="72" height="72" rx="4" fill={PAPER} {...line} />
            <rect x="18" y="26" width="64" height="64" rx="2" fill={wash} {...hair} />
            <g transform="translate(18 26) scale(0.64)">
              <path d="M12 88 C 40 88, 30 64, 56 64 S 88 52, 78 34 S 40 30, 46 16" stroke={mid} strokeDasharray="1 4" strokeWidth="1.5" />
              {[[12, 88], [26, 84], [38, 72], [56, 64], [72, 58], [80, 44], [70, 32], [54, 28], [46, 16]].map(([x, y], i, all) => {
                const end = i === 0 || i === all.length - 1;
                return <circle key={i} cx={x} cy={y} r={end ? 4.2 : 2.8} fill={end ? PAPER : mid} fillOpacity={end ? 1 : 0.7} {...(end ? line : { stroke: "none" })} />;
              })}
            </g>
            <g transform="translate(74 84) rotate(12)">
              <rect x="-7" y="-7" width="14" height="14" rx="3" fill={PAPER} {...line} />
              {[[-3, -3], [3, -3], [0, 0], [-3, 3], [3, 3]].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill={deep} fillOpacity="0.55" stroke="none" />
              ))}
            </g>
          </>
        )}
      </svg>
      <span className="absolute inset-x-0 bottom-[7%] text-center">
        <SoonLabel>{t("comingSoon")}</SoonLabel>
      </span>
    </div>
  );
}

type PaintedProps =
  | ({ variant: "book" } & React.ComponentProps<typeof BookCover>)
  | ({ variant: "product" } & React.ComponentProps<typeof ProductArt>);

/** `<Painted variant="book" …>` or `<Painted variant="product" …>`: the real image when there is one, the plain paper stand-in when not. */
export function Painted(props: PaintedProps) {
  return props.variant === "book" ? <BookCover {...props} /> : <ProductArt {...props} />;
}
