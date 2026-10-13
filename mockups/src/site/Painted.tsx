import type { CSSProperties, ReactNode } from "react";
import { img } from "../shared/assets";
import { ui, type Text, type UniverseId } from "../shared/content";
import type { ProductKind, ShelfBook } from "../shared/content-pages";
import { Creature } from "../shared/creatures";
import { useLang } from "../shared/lang";

// PLACEHOLDER visuals: flat paper, a hairline inner frame and a small "coming soon" note.
// They hold the place of Ramona's real paintings, covers and products until those arrive,
// and are deliberately plain so nobody mistakes them for her work.

const PAPER = "#fffdf9";
const imageSoon: Text = { ro: "Imagine în curând", en: "Image coming soon" };
const coverSoon: Text = { ro: "Copertă în curând", en: "Cover coming soon" };

/** A very pale paper tinted with a universe or wash colour */
const paperOf = (color: string, amount = 40) => `color-mix(in oklab, ${color} ${amount}%, ${PAPER})`;

function SoonLabel({ children }: { children: ReactNode }) {
  return <span className="text-[0.72rem] leading-tight font-bold tracking-[0.08em] text-balance text-ink-soft uppercase">{children}</span>;
}

/** Picture-frame glyph: a rounded frame, a small sun and one mountain line */
function FrameGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 text-ink-soft/50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="9" cy="9.5" r="1.6" />
      <path d="M4 17.5 9.5 12.5 13 15.5 15.5 13.5 20 17.5" />
    </svg>
  );
}

/** Provisional image: fills its parent box (the caller sets shape and aspect via className) */
export function Placeholder({ label, tint = "#fbf7f1", className = "", children }: { label?: string; tint?: string; className?: string; children?: ReactNode }) {
  const { t } = useLang();
  return (
    <div className={`@container relative overflow-hidden ${className}`} style={{ background: tint }}>
      <div className="absolute inset-[6cqi] flex flex-col items-center justify-center gap-2.5 border border-[rgb(52_34_74/0.18)] p-[6cqi] text-center">
        {children ?? (
          <>
            <FrameGlyph />
            <SoonLabel>{label ?? t(imageSoon)}</SoonLabel>
          </>
        )}
      </div>
    </div>
  );
}

// Natural sizes of the real covers, so they render uncropped and without layout shift
const coverSize: Record<string, [number, number]> = {
  "cover-fluturele.webp": [766, 1120],
  "cover-buburuza.webp": [758, 1120],
};

/** A book cover: the real image when there is one, otherwise a paper placeholder with the title. */
export function BookCover({ book, className = "", style }: { book: ShelfBook; className?: string; style?: CSSProperties }) {
  const { t } = useLang();
  const shape = `rounded-r-[10px] rounded-l-[4px] shadow-book ${className}`;
  if (book.cover) {
    const [width, height] = coverSize[book.cover] ?? [766, 1120];
    return (
      <img
        src={img(book.cover)}
        alt={t(book.title)}
        width={width}
        height={height}
        draggable={false}
        className={`art ${shape} block h-auto w-full`}
        style={style}
      />
    );
  }
  const [light, , deep] = book.tint;
  return (
    <div role="img" aria-label={t(book.title)} className={`${shape} aspect-[766/1120] w-full overflow-hidden`} style={style}>
      <Placeholder tint={paperOf(light)} className="h-full w-full">
        <div className="flex h-full w-full flex-col items-center justify-between">
          <span className="display text-[9.5cqw] leading-[1.05]" style={{ color: deep }}>
            {t(book.title)}
          </span>
          {book.universe && <Character universe={book.universe} color={deep} className="w-[34%] opacity-70" />}
          <SoonLabel>{t(coverSoon)}</SoonLabel>
        </div>
      </Placeholder>
    </div>
  );
}

/** The universe's character: the real cover butterfly for Fluture, the line-drawn stand-ins for the rest */
function Character({ universe, color, className = "" }: { universe: UniverseId; color: string; className?: string }) {
  if (universe === "fluture") return <img src={img("butterfly.webp")} alt="" className={`art h-auto ${className}`} draggable={false} />;
  return <Creature id={universe} size="100%" className={className} style={{ color }} />;
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

// Real Fluture products, fanned like a hand: the playing cards and the bookmarks
const fans = {
  carti: { files: ["03", "01", "05"].map((n) => `cards/fluturele-${n}.webp`), box: "h-[66%] aspect-[63/88]", round: "rounded-[7px]", deg: 13 },
  semn: { files: ["01", "04", "08"].map((n) => `bookmarks/fluture-${n}.webp`), box: "h-[72%] aspect-[345/1036]", round: "rounded-[5px]", deg: 10 },
} as const;

/**
 * Product visual. Fluture's cards and bookmarks show the real thing; everything else is a PLACEHOLDER
 * silhouette in hairlines on paper (a bookmark, fanned cards, a puzzle, a little board game)
 * in the universe's tint, until real product photos arrive.
 */
export function ProductArt({
  kind,
  universe,
  tint,
  className = "",
}: {
  kind: ProductKind;
  universe: UniverseId;
  tint: [string, string, string];
  className?: string;
}) {
  const { t } = useLang();
  const fan = universe === "fluture" && (kind === "carti" || kind === "semn") ? fans[kind] : null;
  if (fan) {
    return (
      <div className={`relative grid aspect-[4/5] place-items-center ${className}`} aria-hidden="true">
        <div className={`relative ${fan.box}`}>
          {fan.files.map((file, i) => (
            <img
              key={file}
              src={img(file)}
              alt=""
              draggable={false}
              className={`art absolute inset-0 h-full w-full origin-bottom object-cover shadow-soft ${fan.round}`}
              style={{ transform: `rotate(${(i - 1) * fan.deg}deg) translateY(${i === 1 ? -4 : 0}%)`, zIndex: i === 1 ? 2 : 1 }}
            />
          ))}
        </div>
      </div>
    );
  }

  const [light, mid, deep] = tint;
  const wash = paperOf(light, 45);
  const line = { stroke: deep, strokeOpacity: 0.35 };
  const hair = { stroke: deep, strokeOpacity: 0.18 };
  return (
    <div className={`relative aspect-[4/5] ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 100 125"
        className="absolute inset-0 h-full w-full [&_*]:[vector-effect:non-scaling-stroke]"
        fill="none"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === "semn" && (
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
        {kind === "carti" &&
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
            <path
              transform="translate(64 16) rotate(14 9 9) scale(0.32)"
              d="M6 6 H24 C24 0 36 0 36 6 H54 V24 C60 24 60 36 54 36 V54 H6 Z"
              fill={paperOf(mid, 45)}
              {...line}
            />
          </>
        )}
        {kind === "joc" && (
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
        <SoonLabel>{t(ui.comingSoon)}</SoonLabel>
      </span>
    </div>
  );
}
