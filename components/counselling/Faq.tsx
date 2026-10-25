import { useTranslations } from "next-intl";
import type { RichTextData } from "@/content/types";
import { Plus } from "@/components/ui/icons";
import { RichText } from "@/components/page/RichText";

/** Native <details>: the keyboard and screen readers get a disclosure for free, and every answer is in the HTML while closed.
 *  A question without an answer is not shown (and is not in the FAQPage JSON-LD either). */
export function Faq({ items }: { items: { question: string; answer: RichTextData }[] }) {
  const t = useTranslations("counselling");
  if (items.length === 0) return null;
  return (
    <section className="px-4 pt-4 pb-20 sm:px-6 lg:pb-28" style={{ background: "linear-gradient(180deg, var(--color-cream), #eef2e8)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 className="display max-w-2xl text-[clamp(2.2rem,8.5vw,3.8rem)] font-[380] text-ink">{t("faqTitle")}</h2>
          <div className="faq mt-8 border-t border-ink/12">
            {items.map((f) => (
              <details key={f.question} className="group border-b border-ink/12">
                <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-4 py-4 text-left">
                  <span className="display text-[1.3rem] leading-snug text-ink">{f.question}</span>
                  <span className="faq-plus grid size-10 shrink-0 place-items-center rounded-full bg-cream text-ink ring-1 ring-ink/10">
                    <Plus size={18} />
                  </span>
                </summary>
                <RichText data={f.answer} className="max-w-[58ch] pb-6 text-[1.05rem]" />
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
