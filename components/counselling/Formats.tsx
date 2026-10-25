import type { Counselling } from "@/content/types";
import { Armchair, Video } from "@/components/ui/icons";
import { sessionLabel } from "@/lib/sessions";

/** The hero's signature: the two ways to meet, each with the lengths and prices Ramona set (an empty price is simply left out). */
export function Formats({ formats, sessions }: { formats: Counselling["formats"]; sessions: Counselling["sessions"] }) {
  const rows = sessions.map(sessionLabel);
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {formats.map((f) => {
        const Icon = f.kind === "online" ? Video : Armchair;
        return (
          <li key={f.kind} className="flex gap-4 rounded-[1.75rem] bg-cream/70 p-5 ring-1 ring-ink/5 backdrop-blur-sm">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sage text-leaf">
              <Icon size={22} />
            </span>
            <span className="min-w-0">
              <span className="display block text-[1.4rem] leading-tight text-ink">{f.title}</span>
              <span className="mt-1 block text-[0.98rem] leading-snug text-ink-soft">{f.line}</span>
              {rows.length > 0 && (
                <span className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[0.95rem] tabular-nums">
                  {rows.map((r) => (
                    <span key={r.minutes} className="whitespace-nowrap text-ink-soft">
                      {r.minutes}
                      {r.price && (
                        <>
                          {" · "}
                          <span className="font-semibold text-ink">{r.price}</span>
                        </>
                      )}
                    </span>
                  ))}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
