import type { Counselling } from "@/content/types";
import { Reveal } from "@/components/page/Reveal";

/** „Cum știi dacă este pentru tine?”: the four ways she might find you, then the space she offers */
export function RightForYou({ rightForYou: r }: { rightForYou: Counselling["rightForYou"] }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:py-28" style={{ background: "linear-gradient(180deg, var(--color-cream) 0%, #f1f4ec 18%, #f1f4ec 82%, var(--color-cream) 100%)" }}>
      <div className="mx-auto max-w-[58ch] text-[1.08rem] leading-[1.65] text-ink lg:max-w-[62ch]">
        <h2 className="display max-w-2xl text-[clamp(2.2rem,8.5vw,3.8rem)] font-[380] text-ink">{r.title}</h2>
        <div className="display mt-10 flex flex-col gap-3 text-[clamp(1.3rem,4.2vw,1.7rem)] leading-[1.25] font-[360]">
          {r.maybe.map((m, i) => (
            <Reveal key={m} i={i}>
              <p className="text-balance">{m}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 space-y-5">
          {r.body.map((b, i) => (
            <Reveal key={b} i={i}>
              <p>{b}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <p className="display text-[clamp(1.5rem,5vw,2.1rem)] font-[360] italic text-ink">{r.simply}</p>
        </Reveal>
        <Reveal className="mt-14">
          <p className="display text-[clamp(1.9rem,7vw,3rem)] leading-[1.1] font-[360] text-violet italic">{r.here}</p>
        </Reveal>
        <div className="mt-6 space-y-5">
          {r.offer.map((o, i) => (
            <Reveal key={o} i={i}>
              <p>{o}</p>
            </Reveal>
          ))}
          <Reveal i={2}>
            <p className="font-medium">{r.close}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
