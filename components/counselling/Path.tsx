import type { CSSProperties } from "react";

/** tipare → … → alegere conștientă: painted stops joined by a line that draws itself as it scrolls in (CSS, see .path in globals.css) */
export function Path({ stops, label }: { stops: string[]; label: string }) {
  if (stops.length === 0) return null;
  return (
    <ol aria-label={label} className="path relative mt-12 grid gap-7 pl-12 lg:mt-16 lg:auto-cols-fr lg:grid-flow-col lg:gap-4 lg:pl-0" style={{ "--n": stops.length } as CSSProperties}>
      {/* the line: down the left edge on phones, across the stops on laptop */}
      <span aria-hidden="true" className="path-line absolute top-3 bottom-3 left-[0.95rem] w-[2px] origin-top rounded-full bg-leaf/45 lg:hidden" />
      <span aria-hidden="true" className="path-line path-line-x absolute top-[1.15rem] right-[calc(50%/var(--n))] left-[calc(50%/var(--n))] hidden h-[2px] origin-left rounded-full bg-leaf/45 lg:block" />
      {stops.map((s, i) => {
        const last = i === stops.length - 1;
        return (
          <li key={s} className="path-stop relative flex items-center gap-4 lg:flex-col lg:gap-3 lg:text-center" style={{ "--i": i } as CSSProperties}>
            <span className={`paint-edge relative -ml-12 grid size-[2.4rem] shrink-0 place-items-center rounded-full lg:ml-0 ${last ? "bg-lilac" : "bg-sage"}`} aria-hidden="true">
              <span className={`size-2.5 rounded-full ${last ? "bg-violet" : "bg-leaf"}`} />
            </span>
            <span className={`display text-[1.35rem] leading-tight lg:text-[1.2rem] ${last ? "text-violet italic" : "text-ink"}`}>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}
