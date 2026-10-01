import type { CSSProperties, ReactNode } from "react";
import { img } from "../shared/assets";
import type { UniverseId } from "../shared/content";
import type { ProductKind, ShelfBook } from "../shared/content-pages";
import { Creature } from "../shared/creatures";
import { useLang } from "../shared/lang";

// PLACEHOLDER artwork, painted in code: soft watercolour washes in the Poiana palette.
// They stand in for Ramona's real paintings and covers until those arrive, and are deliberately
// abstract so nobody mistakes them for her work.

/** Small deterministic random from a string, so a placeholder always paints the same way */
function seeded(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function Wash({
  colors,
  seed,
  className = "",
  style,
  children,
}: {
  colors: [string, string, string];
  seed: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const r = seeded(seed);
  // Pigment pools: flat colour that pales towards a slightly darker rim, the way watercolour dries
  const blobs = Array.from({ length: 6 }, (_, i) => ({
    x: 14 + r() * 72,
    y: 12 + r() * 72,
    w: 30 + r() * 44,
    h: 24 + r() * 36,
    c: colors[i % 3],
    o: 0.5 + r() * 0.35,
    rot: Math.round(r() * 60 - 30),
  }));
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: "#fffaf3", ...style }} aria-hidden={children ? undefined : true}>
      <div className="paint-edge absolute inset-[-4%]">
        {blobs.map((b, i) => (
          <span
            key={i}
            className="absolute rounded-[50%] mix-blend-multiply blur-[1.5px]"
            style={{
              left: `${b.x - b.w / 2}%`,
              top: `${b.y - b.h / 2}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
              transform: `rotate(${b.rot}deg)`,
              background: `radial-gradient(closest-side, color-mix(in oklab, ${b.c} 70%, white) 0%, ${b.c} 78%, color-mix(in oklab, ${b.c} 82%, #34224a) 96%, transparent 100%)`,
              opacity: b.o,
            }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}

/** A book cover: the real image when there is one, otherwise a painted stand-in with the title. */
export function BookCover({ book, className = "", style }: { book: ShelfBook; className?: string; style?: CSSProperties }) {
  const { t } = useLang();
  const shape = `aspect-[766/1120] rounded-r-[10px] rounded-l-[4px] shadow-book ${className}`;
  if (book.cover) {
    return <img src={img(book.cover)} alt={t(book.title)} className={`${shape} w-full object-cover`} style={style} />;
  }
  const [light, mid, deep] = book.tint;
  return (
    <div role="img" aria-label={t(book.title)} className={`${shape} @container relative isolate w-full overflow-hidden`} style={style}>
      <Wash colors={[light, mid, light]} seed={book.id} className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${light}, #fffaf3 70%)` }} />
      {/* the spine's soft fold */}
      <span className="absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-[rgb(52_34_74/0.12)] to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 flex flex-col items-center justify-between px-[10%] pt-[12%] pb-[9%] text-center">
        <span className="display text-[9.5cqw] leading-[1.05]" style={{ color: deep }}>
          {t(book.title)}
        </span>
        {book.universe && book.universe !== "fluture" ? (
          <Creature id={book.universe} size="46%" style={{ color: deep }} />
        ) : (
          <span className="paint-edge block aspect-square w-[42%] rounded-full opacity-80" style={{ background: `radial-gradient(circle at 40% 35%, #fff8f1, ${mid} 75%)` }} />
        )}
        <span className="text-[4.6cqw] font-semibold tracking-[0.1em] whitespace-nowrap uppercase" style={{ color: deep, opacity: 0.75 }}>
          Ramona Nichifor
        </span>
      </div>
    </div>
  );
}

/** The universe's character: the real cover butterfly for Fluture, the line-drawn stand-ins for the rest */
function Character({ universe, color, className = "" }: { universe: UniverseId; color: string; className?: string }) {
  if (universe === "fluture") return <img src={img("butterfly.webp")} alt="" className={`h-auto ${className}`} draggable={false} />;
  return <Creature id={universe} size="100%" className={className} style={{ color }} />;
}

/**
 * PLACEHOLDER product visual, painted in code in the universe's colours: a bookmark with its ribbon,
 * three fanned playing cards, or a framed poster. Real product photos replace these.
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
  const [light, mid, deep] = tint;
  const wash: [string, string, string] = [light, mid, light];
  return (
    <div className={`relative grid aspect-[4/5] place-items-center ${className}`} aria-hidden="true">
      {kind === "semn" && (
        <div className="relative h-[84%] w-[30%] -rotate-[4deg]">
          <Wash colors={wash} seed={`${universe}-semn`} className="h-full w-full rounded-t-[999px] rounded-b-[6px] shadow-soft">
            <div className="absolute inset-x-[18%] top-[16%]">
              <Character universe={universe} color={deep} className="w-full" />
            </div>
            <span className="absolute inset-x-[22%] bottom-[8%] h-px" style={{ background: deep, opacity: 0.35 }} />
          </Wash>
          {/* the ribbon */}
          <span className="absolute top-full left-1/2 h-[14%] w-[3px] -translate-x-1/2 rounded-full" style={{ background: mid }} />
          <span className="absolute top-[112%] left-1/2 size-2.5 -translate-x-1/2 rounded-full" style={{ background: deep, opacity: 0.8 }} />
        </div>
      )}
      {kind === "carti" && (
        <div className="relative h-[62%] w-[44%]">
          {[-14, 0, 14].map((deg, i) => (
            <div
              key={deg}
              className="absolute inset-0 origin-bottom rounded-[10px] bg-[#fffdf9] p-[6%] shadow-soft"
              style={{ transform: `rotate(${deg}deg) translateY(${i === 1 ? -4 : 0}%)`, zIndex: i === 1 ? 2 : 1 }}
            >
              <div className="h-full w-full rounded-[6px]" style={{ boxShadow: `inset 0 0 0 1.5px ${mid}` }}>
                {i === 1 && (
                  <div className="grid h-full place-items-center p-[14%]">
                    <Character universe={universe} color={deep} className="w-full" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {kind === "poster" && (
        <div className="w-[70%] rotate-[1.5deg] rounded-[3px] bg-[#fffdf9] p-[5%] shadow-soft">
          <Wash colors={wash} seed={`${universe}-poster`} className="aspect-[3/4] w-full">
            <div className="absolute inset-[22%]">
              <Character universe={universe} color={deep} className="w-full" />
            </div>
          </Wash>
        </div>
      )}
    </div>
  );
}
