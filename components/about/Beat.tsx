import { Reveal } from "@/components/page/Reveal";

type Kind = "beat" | "question" | "closing";

/** One beat of her story. Her `\n\n` paragraph breaks become paragraphs; her questions arrive one per line; the closing is set large. */
export function Beat({ kind, text, i }: { kind: Kind; text: string; i: number }) {
  const paras = text.split("\n\n");
  if (kind === "question")
    return (
      <Reveal i={i} className="my-9!">
        <p data-kind="question" className="display flex flex-col gap-2 text-[clamp(1.4rem,4.4vw,1.85rem)] leading-[1.22] font-[360] text-ink">
          {text.split(/(?<=\?)\s+/).map((q) => (
            <span key={q} className="text-balance">
              {q}
            </span>
          ))}
        </p>
      </Reveal>
    );
  if (kind === "closing")
    return (
      <Reveal i={i} className="mt-16!">
        <div data-kind="closing" className="space-y-4">
          {paras.map((x, n) => (
            <p key={n} className="display text-[clamp(1.6rem,6vw,2.6rem)] leading-[1.15] font-[360] text-ink text-balance">
              {x}
            </p>
          ))}
        </div>
      </Reveal>
    );
  return (
    <Reveal i={i}>
      <div data-kind="beat" className="space-y-5">
        {paras.map((x, n) => (
          <p key={n}>{x}</p>
        ))}
      </div>
    </Reveal>
  );
}
