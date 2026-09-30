import type { ConceptId } from "./content";
import { concepts, mockupNote } from "./content";
import { ArrowRight } from "./icons";
import { useLang } from "./lang";

// Thin label above every concept: makes the page read as a design proposal
// and gives the client a name to use in feedback.
export function ConceptStrip({ concept }: { concept: ConceptId }) {
  const { t } = useLang();
  const c = concepts.find((x) => x.id === concept)!;
  return (
    <div className="concept-strip relative z-40" style={{ background: "var(--strip-bg)", color: "var(--strip-ink)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 text-[0.78rem] leading-tight sm:px-6">
        <p className="py-2">
          <span className="font-semibold">Concept {c.letter} · {t(c.name)}</span>
          <span className="opacity-75"> · {t(mockupNote.chip)}</span>
        </p>
        <a href="index.html" className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 font-semibold underline-offset-4 hover:underline">
          {t(mockupNote.all)}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
