import type { CSSProperties } from "react";
import { Butterfly } from "@/components/poiana/Butterfly";

// left/top in % of the window, w in %, resting tilt (deg), where it flies in from (px), wingbeat (s; 0 = the profile bookmark butterfly, which glides)
const butterflies = [
  { left: 50, top: 20, w: 34, tilt: -6, from: [0, -120], tempo: 0.62 },
  { left: 21, top: 41, w: 25, tilt: 6, from: [-160, -30], tempo: 0 },
  { left: 80, top: 34, w: 23, tilt: -14, from: [170, -40], tempo: 0.55 },
  { left: 61, top: 50, w: 17, tilt: -4, from: [150, 60], tempo: 0 },
  { left: 33, top: 15, w: 14, tilt: 10, from: [-120, -90], tempo: 0.48 },
  { left: 43, top: 61, w: 15, tilt: -8, from: [-90, 110], tempo: 0.58 },
];
// ladybirds land low on the flowers; sway = seconds of one rock
const ladybirds = [
  { left: 31, top: 73, w: 19, tilt: -6, from: [-190, -110], sway: 5.6 },
  { left: 70, top: 78, w: 15, tilt: 7, from: [200, -90], sway: 6.2 },
  { left: 86, top: 66, w: 10, tilt: -3, from: [120, -140], sway: 5.1 },
];

const vars = (o: Record<string, string | number>) => o as CSSProperties;

/**
 * Gathering (spec §5.7b): butterflies fly in from every side and settle above the meadow inside an arch window, the way people
 * gather around a story; then Buburuza and two friends land on the flower line. Pure CSS (`.gather`, `.perch-*` in globals.css):
 * server-rendered, in place without JavaScript, and under reduced motion everyone is simply there, still.
 */
export function GatheringCircle() {
  return (
    <div className="relative mx-auto w-[min(68vw,320px)]" aria-hidden="true">
      <div className="arch shadow-soft relative aspect-[4/5] overflow-hidden" style={{ background: "linear-gradient(180deg, #dbe7f4 0%, #ece6f5 45%, #f6e2ea 70%, var(--color-cream) 100%)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative cut-outs */}
        <img
          src="/img/meadow.webp"
          alt=""
          width={645}
          height={505}
          className="absolute inset-x-0 bottom-0 h-[46%] w-full object-cover object-[50%_100%]"
          style={{ maskImage: "linear-gradient(180deg, transparent 0%, #000 30%)", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 30%)" }}
        />
        {butterflies.map((b, i) => (
          <div key={`b${i}`} data-kind="butterfly" className="absolute" style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.w}%`, translate: "-50% -50%" }}>
            <div className="gather" style={vars({ "--tilt": `${b.tilt}deg`, "--fx": `${b.from[0]}px`, "--fy": `${b.from[1]}px`, "--delay": `${0.25 + i * 0.22}s` })}>
              {b.tempo ? (
                <div className="perch-bob" style={vars({ "--dur": `${4.2 + i * 0.6}s`, "--dl": `${i * -0.9}s` })}>
                  <Butterfly width="100%" tempo={b.tempo} />
                </div>
              ) : (
                // drawn in profile, so it glides instead of flapping
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/img/butterfly-bookmark.webp"
                  alt=""
                  width={325}
                  height={433}
                  draggable={false}
                  className="perch-glide block h-auto w-full"
                  style={vars({ "--dur": `${5 + i * 0.5}s`, "--dl": `${i * -1.1}s` })}
                />
              )}
            </div>
          </div>
        ))}
        {ladybirds.map((l, i) => (
          <div key={`l${i}`} data-kind="ladybird" className="absolute" style={{ left: `${l.left}%`, top: `${l.top}%`, width: `${l.w}%`, translate: "-50% -50%" }}>
            <div className="gather" style={vars({ "--tilt": `${l.tilt}deg`, "--fx": `${l.from[0]}px`, "--fy": `${l.from[1]}px`, "--delay": `${1.15 + i * 0.28}s` })}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/ladybird.webp" alt="" width={457} height={508} draggable={false} className="ladybird perch-sway block h-auto w-full" style={vars({ "--dur": `${l.sway}s`, "--dl": `${i * -1.7}s` })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
